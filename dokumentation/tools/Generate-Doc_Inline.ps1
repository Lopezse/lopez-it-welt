# ==============================================================
# Lopez IT Welt - AEVO Inline DOCX Generator 2025 (Enterprise Clean Edition)
# Einmalige Inline-Bilder mit Rahmen & CI-Layout, Kopf-/Fußzeile, saubere Struktur
# Autor: Ramiro Lopez Rodriguez | Lopez IT Welt | IHK Hannover 2025
# ==============================================================

$sourceDoc = "D:\Projekte\lopez-it-welt\dokumentation\aevo\AEVO_Nachweis_2025\System_und_Lizenzsicherung_2025.docx"
$targetDoc = "D:\Projekte\lopez-it-welt\dokumentation\aevo\AEVO_Nachweis_2025\System_und_Lizenzsicherung_2025_Clean.docx"
$mediaPath = "D:\Projekte\lopez-it-welt\dokumentation\aevo\AEVO_Nachweis_2025\Medien\"

$images = @(
    @{File="Systeminfo.png";        Caption="Systeminformationen (Windows 11 Pro)";          Keyword="Systemumgebung"},
    @{File="Explorer_Backup.png";   Caption="Backup-Struktur (D:\C_Backup_2025)";            Keyword="Sicherung"},
    @{File="CMD_Lizenz.png";        Caption="Office-Lizenzprüfung (ospp.vbs /dstatus)";      Keyword="Lizenzprüfung"},
    @{File="OfficeLizenz_Info.png"; Caption="Gesicherte Lizenzdaten (OfficeLizenz_Info.txt)"; Keyword="Lizenzdaten"}
)

function RGB($r,$g,$b){ return ($b*65536 + $g*256 + $r) }

$wdHeaderFooterPrimary = 1
$wdAlignCenter = 1
$wdAlignRight = 2
$wdPageBreak = 7
$wdFieldPage = 33
$wdFieldNumPages = 26

$word = New-Object -ComObject Word.Application
$word.Visible = $false
$doc = $word.Documents.Add()

# Seitenlayout und Schrift
$doc.PageSetup.TopMargin    = $word.CentimetersToPoints(2.5)
$doc.PageSetup.BottomMargin = $word.CentimetersToPoints(2.5)
$doc.PageSetup.LeftMargin   = $word.CentimetersToPoints(2.5)
$doc.PageSetup.RightMargin  = $word.CentimetersToPoints(2.5)
$doc.Styles.Item("Normal").Font.Name = "Calibri"
$doc.Styles.Item("Normal").Font.Size = 11

# Kopf- und Fußzeile
foreach($section in $doc.Sections){
    $hdr = $section.Headers.Item($wdHeaderFooterPrimary).Range
    $hdr.Text = "Lopez IT Welt - System- und Projektdokumentation 2025"
    $hdr.ParagraphFormat.Alignment = $wdAlignCenter
    $hdr.Font.Color = RGB 0 86 166

    $ftr = $section.Footers.Item($wdHeaderFooterPrimary).Range
    $ftr.ParagraphFormat.Alignment = $wdAlignRight
    $ftr.Text = "Ramiro Lopez Rodriguez | Lopez IT Welt | IHK Hannover 2025 - Seite "
    $ftr.Fields.Add($ftr, $wdFieldPage) | Out-Null
    $ftr.InsertAfter(" von ")
    $ftr.Fields.Add($ftr, $wdFieldNumPages) | Out-Null
}

$sel = $word.Selection
$sel.ParagraphFormat.Alignment = $wdAlignCenter
$sel.Font.Size = 22
$sel.Font.Bold = $true
$sel.Font.Color = RGB 0 86 166
$sel.TypeText("Lopez IT Welt - System- und Lizenzsicherung 2025")
$sel.TypeParagraph()
$sel.Font.Size = 14
$sel.Font.Bold = $false
$sel.TypeText("AEVO-Nachweis / IHK Hannover 2025")
$sel.TypeParagraph(); $sel.TypeParagraph()
$sel.Font.Size = 12
$sel.TypeText("Version 1.0 / Oktober 2025")
$sel.TypeParagraph()
$sel.TypeText("Autor: Ramiro Lopez Rodriguez - Wunstorf")
$sel.InsertBreak($wdPageBreak)

# Inhaltsverzeichnis
$toc = $doc.TablesOfContents.Add($sel.Range, $true, 1, 3)
$sel.InsertBreak($wdPageBreak)

# Hauptinhalt einfügen
if(Test-Path $sourceDoc){ $sel.InsertFile($sourceDoc) } else { $sel.TypeText("Quelle fehlt: $sourceDoc") }

# Inline-Bilder automatisch einfügen
$index = 1
foreach($img in $images){
    $path = Join-Path $mediaPath $img.File
    if(Test-Path $path){
        $find = $word.Selection.Find
        $find.Text = $img.Keyword
        $find.Forward = $true
        $find.Execute()
        if($find.Found){
            $word.Selection.MoveDown()
            $pic = $word.Selection.InlineShapes.AddPicture($path)
            $pic.Width = $word.CentimetersToPoints(16)
            $pic.Borders.Enable = $true
            $pic.Borders.OutsideLineStyle = 1
            $pic.Borders.OutsideLineWidth = 0.75
            $pic.Shadow = $true
            $word.Selection.TypeParagraph()
            $word.Selection.ParagraphFormat.Alignment = $wdAlignCenter
            $word.Selection.Font.Size = 10
            $word.Selection.TypeText("Abb. $index - $($img.Caption)")
            $word.Selection.TypeParagraph()
            $index++
        }
    }
}

# TOC aktualisieren
if($doc.TablesOfContents.Count -gt 0){ $doc.TablesOfContents.Item(1).Update() }

$doc.SaveAs([ref]$targetDoc)
$word.Quit()

Write-Host ""
Write-Host "==============================================================="
Write-Host " AEVO Inline DOCX Generator 2025 - Lopez IT Welt (Clean Edition)"
Write-Host " Fertig: $targetDoc"
Write-Host "==============================================================="
