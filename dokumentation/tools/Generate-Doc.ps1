# Lopez IT Welt - AEVO DOCX Generator 2025 (mit Bildern, CI-Layout, Deckblatt)
# UTF-8 kompatibel, keine Sonderzeichen
# Pfade (an dein Setup angepasst)
$sourceDoc = "D:\Projekte\lopez-it-welt\dokumentation\aevo\AEVO_Nachweis_2025\System_und_Lizenzsicherung_2025.docx"
$targetDoc = "D:\Projekte\lopez-it-welt\dokumentation\aevo\AEVO_Nachweis_2025\System_und_Lizenzsicherung_2025_Pro.docx"
$mediaPath = "D:\Projekte\lopez-it-welt\dokumentation\aevo\AEVO_Nachweis_2025\Medien\"

# Bildliste
$images = @(
  @{File="Explorer_Backup.png"; Caption="Backup-Struktur (D:\C_Backup_2025)"},
  @{File="CMD_Lizenz.png"; Caption="Office-Lizenzprüfung (ospp.vbs /dstatus)"},
  @{File="OfficeLizenz_Info.png"; Caption="Gesicherte Lizenzdaten (OfficeLizenz_Info.txt)"},
  @{File="Systeminfo.png"; Caption="Systeminformationen (Windows 11 Pro)"}
)

# Word-Konstanten & Hilfsfunktion
$wdHeaderFooterPrimary = 1
$wdAlignCenter = 1
$wdAlignRight = 2
$wdPageBreak = 7
$wdFieldPage = 33
function RGB($r,$g,$b){ return ($b*65536 + $g*256 + $r) }

# Word starten
$word = New-Object -ComObject Word.Application
$word.Visible = $false
$doc = $word.Documents.Add()

# Seitenlayout & Schrift
$doc.PageSetup.TopMargin    = $word.CentimetersToPoints(2.5)
$doc.PageSetup.BottomMargin = $word.CentimetersToPoints(2.5)
$doc.PageSetup.LeftMargin   = $word.CentimetersToPoints(2.5)
$doc.PageSetup.RightMargin  = $word.CentimetersToPoints(2.5)
$doc.Styles.Item("Normal").Font.Name = "Calibri"
$doc.Styles.Item("Normal").Font.Size = 11
$doc.Styles.Item("Normal").ParagraphFormat.LineSpacingRule = 1
$doc.Styles.Item("Normal").ParagraphFormat.SpaceAfter = 6

# Kopf-/Fußzeile (CI)
foreach($section in $doc.Sections){
    $hdr = $section.Headers.Item($wdHeaderFooterPrimary).Range
    $hdr.ParagraphFormat.Alignment = $wdAlignCenter
    $hdr.Text = "Lopez IT Welt - System- und Projektdokumentation 2025"

    $ftr = $section.Footers.Item($wdHeaderFooterPrimary).Range
    $ftr.ParagraphFormat.Alignment = $wdAlignRight
    $ftr.Text = "Ramiro Lopez Rodriguez | Lopez IT Welt | IHK Hannover 2025 - Seite "
    $ftr.Collapse(0) | Out-Null
    $null = $ftr.Fields.Add($ftr, $wdFieldPage)
}

$sel = $word.Selection

# Deckblatt
$sel.ParagraphFormat.Alignment = $wdAlignCenter
$sel.Font.Name = "Calibri"; $sel.Font.Size = 22; $sel.Font.Bold = $true
$sel.Font.TextColor.RGB = RGB 0 86 166
$sel.TypeText("Lopez IT Welt - System- und Lizenzsicherung 2025")
$sel.TypeParagraph()
$sel.Font.Size = 14; $sel.Font.Bold = $false
$sel.TypeText("AEVO-Nachweis / IHK Hannover 2025")
$sel.TypeParagraph(); $sel.TypeParagraph()
$sel.Font.Size = 12
$sel.TypeText("Version 1.0 / Oktober 2025")
$sel.TypeParagraph()
$sel.TypeText("Autor: Ramiro Lopez Rodriguez - Wunstorf")
$sel.TypeParagraph(); $sel.TypeParagraph()
$sel.InsertBreak($wdPageBreak)

# Inhaltsverzeichnis
$toc = $doc.TablesOfContents.Add($sel.Range, $true, 1, 3)
$sel.TypeParagraph()
$sel.InsertBreak($wdPageBreak)

# Hauptinhalt einfügen
if(Test-Path $sourceDoc){
    $sel.InsertFile($sourceDoc)
    $sel.TypeParagraph()
}else{
    $sel.TypeText("Quelle nicht gefunden: " + $sourceDoc)
    $sel.TypeParagraph()
}

# Abschnitt Abbildungen
$sel.InsertBreak($wdPageBreak)
$sel.Font.Size = 16; $sel.Font.Bold = $true
$sel.Font.TextColor.RGB = RGB 0 86 166
$sel.TypeText("Abbildungen")
$sel.TypeParagraph()
$sel.Font.Size = 11; $sel.Font.Bold = $false
$sel.Font.TextColor.RGB = RGB 0 0 0
$sel.TypeParagraph()

# Bilder einfügen
$index = 1
foreach($img in $images){
    $path = Join-Path $mediaPath $img.File
    if(Test-Path $path){
        $sel.ParagraphFormat.Alignment = $wdAlignCenter
        $pic = $sel.InlineShapes.AddPicture($path)
        $pic.Width = $word.CentimetersToPoints(16)
        $sel.TypeParagraph()
        $sel.ParagraphFormat.Alignment = $wdAlignCenter
        $sel.Font.Italic = $false; $sel.Font.Size = 10
        $sel.TypeText(("Abb. {0} - {1}" -f $index, $img.Caption))
        $sel.TypeParagraph(); $sel.TypeParagraph()
        $index++
    }
}

# TOC aktualisieren
if($doc.TablesOfContents.Count -gt 0){ $doc.TablesOfContents.Item(1).Update() }

# Speichern & schließen
$doc.SaveAs([ref]$targetDoc)
$word.Quit()
Write-Host ("Fertig: " + $targetDoc)
