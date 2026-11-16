"""Build the printable customer room brief; no unpublished product facts."""
from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.colors import HexColor
from reportlab.platypus import Paragraph
from reportlab.lib.styles import ParagraphStyle
import shutil

root = Path(__file__).resolve().parent.parent
output = root / 'output' / 'pdf' / 'pgm-room-measurement-worksheet.pdf'
output.parent.mkdir(parents=True, exist_ok=True)
c = canvas.Canvas(str(output), pagesize=A4)
c.setTitle('PGM Golf Simulator Room Measurement Worksheet')
c.setAuthor('PGM')
c.setSubject('A printable project brief for a room and equipment configuration review')
width, height = A4
left, right = 42, width - 42
green, ink, grey = HexColor('#25723d'), HexColor('#12261c'), HexColor('#54635b')

def text(x, y, value, size=9, bold=False, color=ink):
    c.setFillColor(color)
    c.setFont('Helvetica-Bold' if bold else 'Helvetica', size)
    c.drawString(x, y, value)

def para(value, x, top, available, size=9, leading=13, color=ink):
    p = Paragraph(value, ParagraphStyle('copy', fontName='Helvetica', fontSize=size, leading=leading, textColor=color))
    _, h = p.wrap(available, 300)
    p.drawOn(c, x, top - h)
    return top - h

def rule(y):
    c.setStrokeColor(HexColor('#b5c8ba'))
    c.setLineWidth(.6)
    c.line(left, y, right, y)

def field(label, x, y, available):
    text(x, y, label, 8.5, True)
    c.setStrokeColor(HexColor('#9dac9f'))
    c.line(x, y - 25, x + available, y - 25)

text(left, 802, 'PGM / SIMULATOR PLANNING', 10, True, green)
text(left, 770, 'Room measurement worksheet', 23, True)
para('Collect the site details before choosing a configuration. Use clear measurements inside the finished room and one set of units throughout.', left, 749, right-left, 9, 13, grey)
rule(711)
field('Project / room name', left, 692, 239)
field('Country / destination', 314, 692, right-314)
text(left, 642, '01  CLEAR ROOM DIMENSIONS', 10, True, green)
text(right-140, 642, 'Units (circle):  metres / feet', 8, color=grey)
field('Clear width', left, 619, 152)
field('Clear depth', 221, 619, 152)
field('Lowest clear height', 400, 619, right-400)
para('Measure below the lowest beam, light or other fixed obstruction. Record equipment dimensions separately from the room dimensions.', left, 582, right-left, 8, 11, grey)
text(left, 544, '02  ROOM SKETCH / OBSTRUCTIONS', 10, True, green)
para('Mark the proposed screen and hitting area, doors, windows, beams, columns, lights and access. Add dimensions. This sketch is not to scale.', left, 529, right-left, 8, 11, grey)
c.setStrokeColor(HexColor('#9dac9f'))
c.setLineWidth(.6)
c.rect(left, 308, right-left, 185)
field('Lowest obstruction and its position', left, 286, right-left)
text(left, 232, '03  PLAYERS / EQUIPMENT / USE', 10, True, green)
text(left, 213, 'Use (circle):   home / coaching / commercial venue / other', 8.5)
text(left, 195, 'Players (circle):   right-handed / left-handed / both', 8.5)
field('Existing equipment / requested options', left, 175, right-left)
text(left, 126, '04  SEND YOUR BRIEF', 10, True, green)
para('Email this sheet and clear room photos to <b>tracy@pgmgolf.com</b>, or enter the measurements in the website enquiry form. Include the intended players and any installation constraints.', left, 112, right-left, 8.5, 12)
para('Planning only. Room size, equipment placement and the full swing envelope must be reviewed together. This worksheet is not an installation drawing or an approval of swing clearance.', left, 76, right-left, 7.5, 10, grey)
rule(47)
text(left, 32, 'Room references: mypgmgolf.com/guides/golf-simulator-room-size/', 7.5, color=green)
c.linkURL('https://mypgmgolf.com/guides/golf-simulator-room-size/', (left, 28, right, 42), relative=0)
text(left, 20, 'PGM | Reviewed 16 November 2026 | Printable project brief', 7, color=grey)
text(right-22, 20, '1 / 1', 7, color=grey)
c.showPage()
c.save()
target = root / 'assets' / output.name
shutil.copyfile(output, target)
print(f'Created {output} and matching website asset ({target.stat().st_size} bytes).')
