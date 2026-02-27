#!/usr/bin/env python3
"""Generate a professional org chart PDF from the library organizational structure."""

import graphviz

def create_orgchart():
    dot = graphviz.Digraph('OrgChart', format='pdf')

    # Global graph settings - more vertical, tighter layout
    dot.attr(
        rankdir='TB',
        splines='ortho',
        nodesep='0.4',
        ranksep='0.7',
        bgcolor='white',
        pad='0.4',
        dpi='300',
        size='14,18',
        ratio='compress',
    )

    # Default node style
    dot.attr('node',
        shape='box',
        style='filled,rounded',
        fontname='Helvetica',
        fontsize='10',
        margin='0.2,0.12',
        penwidth='1.5',
    )

    dot.attr('edge',
        color='#5B6770',
        penwidth='1.5',
        arrowsize='0.6',
        arrowhead='vee',
    )

    # === COLOR PALETTE ===
    dean_fill = '#1B3A5C'
    dean_font = 'white'
    manager_fill = '#2E6B8A'
    manager_font = 'white'
    coord_fill = '#4A90B8'
    coord_font = 'white'
    staff_fill = '#D6E8F0'
    staff_font = '#1B3A5C'
    librarian_fill = '#E8D5B7'
    librarian_font = '#3D2B1F'
    vacant_fill = '#E8E8E8'
    vacant_font = '#666666'

    # === TOP LEVEL: INTERIM DEAN ===
    dot.node('amy',
        label='<<TABLE BORDER="0" CELLPADDING="4" CELLSPACING="0">'
              '<TR><TD><B><FONT POINT-SIZE="14">Interim Dean</FONT></B></TD></TR>'
              '<TR><TD><FONT POINT-SIZE="12">Amy Jiang</FONT></TD></TR>'
              '</TABLE>>',
        fillcolor=dean_fill, fontcolor=dean_font, color='#0F2540',
        penwidth='2.5', width='2.5')

    # === DIRECT REPORTS (LEFT SIDE) ===

    dot.node('wayne',
        label='<<TABLE BORDER="0" CELLPADDING="2" CELLSPACING="0">'
              '<TR><TD><B><FONT POINT-SIZE="9">Executive Assistant &amp;</FONT></B></TD></TR>'
              '<TR><TD><B><FONT POINT-SIZE="9">Learning Commons Manager</FONT></B></TD></TR>'
              '<TR><TD><FONT POINT-SIZE="9">Wayne Thurston</FONT></TD></TR>'
              '</TABLE>>',
        fillcolor=manager_fill, fontcolor=manager_font, color='#1D4F6B')

    dot.node('jennifer',
        label='<<TABLE BORDER="0" CELLPADDING="2" CELLSPACING="0">'
              '<TR><TD><B><FONT POINT-SIZE="9">Head of Collections</FONT></B></TD></TR>'
              '<TR><TD><B><FONT POINT-SIZE="9">&amp; Scholarship</FONT></B></TD></TR>'
              '<TR><TD><FONT POINT-SIZE="9">Jennifer Cady</FONT></TD></TR>'
              '</TABLE>>',
        fillcolor=manager_fill, fontcolor=manager_font, color='#1D4F6B')

    dot.node('keren',
        label='<<TABLE BORDER="0" CELLPADDING="2" CELLSPACING="0">'
              '<TR><TD><B><FONT POINT-SIZE="9">Archives &amp; Special</FONT></B></TD></TR>'
              '<TR><TD><B><FONT POINT-SIZE="9">Collections Librarian</FONT></B></TD></TR>'
              '<TR><TD><FONT POINT-SIZE="9">Keren Darancette</FONT></TD></TR>'
              '</TABLE>>',
        fillcolor=coord_fill, fontcolor=coord_font, color='#2E6B8A')

    dot.node('sabrina',
        label='<<TABLE BORDER="0" CELLPADDING="2" CELLSPACING="0">'
              '<TR><TD><B><FONT POINT-SIZE="9">Communications Coord. &amp;</FONT></B></TD></TR>'
              '<TR><TD><B><FONT POINT-SIZE="9">Interim Makerspace Mgr</FONT></B></TD></TR>'
              '<TR><TD><FONT POINT-SIZE="9">Sabrina Mora</FONT></TD></TR>'
              '</TABLE>>',
        fillcolor=coord_fill, fontcolor=coord_font, color='#2E6B8A')

    dot.node('bil',
        label='<<TABLE BORDER="0" CELLPADDING="2" CELLSPACING="0">'
              '<TR><TD><B><FONT POINT-SIZE="9">LLC Data Analyst</FONT></B></TD></TR>'
              '<TR><TD><FONT POINT-SIZE="9">Bil Owen</FONT></TD></TR>'
              '</TABLE>>',
        fillcolor=coord_fill, fontcolor=coord_font, color='#2E6B8A')

    dot.node('law_coord',
        label='<<TABLE BORDER="0" CELLPADDING="2" CELLSPACING="0">'
              '<TR><TD><B><FONT POINT-SIZE="9">Coordinator of Library of</FONT></B></TD></TR>'
              '<TR><TD><B><FONT POINT-SIZE="9">Law &amp; Public Admin</FONT></B></TD></TR>'
              '<TR><TD><I><FONT POINT-SIZE="9">(Vacant)</FONT></I></TD></TR>'
              '</TABLE>>',
        fillcolor=vacant_fill, fontcolor=vacant_font, color='#999999',
        style='filled,rounded,dashed')

    # === R&I TEAM CLUSTER ===
    with dot.subgraph(name='cluster_ri_team') as ri:
        ri.attr(
            label='<<TABLE BORDER="0" CELLPADDING="5"><TR><TD><B><FONT POINT-SIZE="11" COLOR="#6B3A2E">Research &amp; Instruction Team</FONT></B></TD></TR><TR><TD><FONT POINT-SIZE="8" COLOR="#8B6B5E">All members report directly to Interim Dean</FONT></TD></TR></TABLE>>',
            style='filled,rounded',
            color='#C4956A',
            fillcolor='#FFF8F0',
            penwidth='2',
            fontname='Helvetica',
            margin='15',
        )

        ri.node('karen',
            label='<<TABLE BORDER="0" CELLPADDING="2" CELLSPACING="0">'
                  '<TR><TD><B><FONT POINT-SIZE="9">Coordinator, Research</FONT></B></TD></TR>'
                  '<TR><TD><B><FONT POINT-SIZE="9">&amp; Instruction</FONT></B></TD></TR>'
                  '<TR><TD><FONT POINT-SIZE="9">Karen Beavers</FONT></TD></TR>'
                  '</TABLE>>',
            fillcolor='#C4956A', fontcolor='white', color='#8B6B3D')

        for name, fullname in [('linda', 'Linda Gordon'), ('cathy', 'Cathy Johnson'),
                                ('liberty', 'Liberty McCoy'), ('vinaya', 'Vinaya Tripuraneni')]:
            ri.node(name,
                label=f'<<TABLE BORDER="0" CELLPADDING="2" CELLSPACING="0">'
                      f'<TR><TD><B><FONT POINT-SIZE="8">R&amp;I Librarian</FONT></B></TD></TR>'
                      f'<TR><TD><FONT POINT-SIZE="8">{fullname}</FONT></TD></TR>'
                      f'</TABLE>>',
                fillcolor=librarian_fill, fontcolor=librarian_font, color='#C4A882')

        ri.node('ri_vacant',
            label='<<TABLE BORDER="0" CELLPADDING="2" CELLSPACING="0">'
                  '<TR><TD><B><FONT POINT-SIZE="8">R&amp;I Librarian</FONT></B></TD></TR>'
                  '<TR><TD><I><FONT POINT-SIZE="8">(Vacant)</FONT></I></TD></TR>'
                  '</TABLE>>',
            fillcolor=vacant_fill, fontcolor=vacant_font, color='#999999',
            style='filled,rounded,dashed')

        # Dashed coordination lines inside cluster
        ri.attr('edge', style='dashed', color='#C4956A', penwidth='1', arrowhead='none')
        for name in ['linda', 'cathy', 'liberty', 'vinaya', 'ri_vacant']:
            ri.edge('karen', name)

    # === STAFF LEVEL ===
    for nid, title, name in [('ben', 'Circulation Supervisor', 'Ben Mulchin'),
                              ('matt', 'Circulation Supervisor', 'Matt Durian'),
                              ('marissa', 'Weekend Circ. Supervisor', 'Marissa Corona')]:
        dot.node(nid,
            label=f'<<TABLE BORDER="0" CELLPADDING="2" CELLSPACING="0">'
                  f'<TR><TD><B><FONT POINT-SIZE="8">{title}</FONT></B></TD></TR>'
                  f'<TR><TD><FONT POINT-SIZE="8">{name}</FONT></TD></TR>'
                  f'</TABLE>>',
            fillcolor=staff_fill, fontcolor=staff_font, color='#A0C4D8')

    dot.node('sean',
        label='<<TABLE BORDER="0" CELLPADDING="2" CELLSPACING="0">'
              '<TR><TD><B><FONT POINT-SIZE="8">Makerspace Manager</FONT></B></TD></TR>'
              '<TR><TD><FONT POINT-SIZE="8">Sean Beslin</FONT></TD></TR>'
              '</TABLE>>',
        fillcolor=staff_fill, fontcolor=staff_font, color='#A0C4D8')

    dot.node('david',
        label='<<TABLE BORDER="0" CELLPADDING="2" CELLSPACING="0">'
              '<TR><TD><B><FONT POINT-SIZE="8">Law Library Manager</FONT></B></TD></TR>'
              '<TR><TD><FONT POINT-SIZE="8">David Austin</FONT></TD></TR>'
              '</TABLE>>',
        fillcolor=staff_fill, fontcolor=staff_font, color='#A0C4D8')

    # === EDGES - Direct reporting lines ===
    dot.attr('edge', style='solid', color='#5B6770', penwidth='1.5', arrowhead='vee', arrowsize='0.6')

    # Amy's direct reports - single line to R&I team (through Karen)
    dot.edge('amy', 'wayne')
    dot.edge('amy', 'jennifer')
    dot.edge('amy', 'keren')
    dot.edge('amy', 'sabrina')
    dot.edge('amy', 'bil')
    dot.edge('amy', 'law_coord')
    dot.edge('amy', 'karen')

    # Wayne's reports
    dot.edge('wayne', 'ben')
    dot.edge('wayne', 'matt')
    dot.edge('wayne', 'marissa')

    # Sabrina's report
    dot.edge('sabrina', 'sean')

    # Law coord's report
    dot.edge('law_coord', 'david')

    # === LEGEND (bottom-right) ===
    with dot.subgraph(name='cluster_legend') as legend:
        legend.attr(
            label='<<B><FONT POINT-SIZE="10">Legend</FONT></B>>',
            style='filled,rounded',
            color='#CCCCCC',
            fillcolor='#F8F8F8',
            fontname='Helvetica',
            margin='10',
        )
        legend.node('leg1', label='<<FONT POINT-SIZE="8">━━━  Direct reporting</FONT>>', shape='plaintext', fillcolor='#F8F8F8')
        legend.node('leg2', label='<<FONT POINT-SIZE="8">- - -  Coordination (not direct report)</FONT>>', shape='plaintext', fillcolor='#F8F8F8')
        legend.node('leg3', label='<<FONT POINT-SIZE="8" COLOR="#999999">▭  Dashed border = Vacant position</FONT>>', shape='plaintext', fillcolor='#F8F8F8')
        legend.edge('leg1', 'leg2', style='invis')
        legend.edge('leg2', 'leg3', style='invis')

    return dot


if __name__ == '__main__':
    chart = create_orgchart()

    # Render PDF
    chart.render('orgchart_corrected', cleanup=True)
    print("Generated: orgchart_corrected.pdf")

    # Also render PNG for preview
    chart.format = 'png'
    chart.render('orgchart_corrected_preview', cleanup=True)
    print("Generated: orgchart_corrected_preview.png")
