// Chromosome + position for every disease-relevant SNP
// Used to generate valid 23andMe-format TSV test files
export const SNP_METADATA: Record<string, { chromosome: string; position: string }> = {
  'rs113993960': { chromosome: '7',  position: '117548628' }, // CFTR ΔF508
  'rs75961395':  { chromosome: '7',  position: '117534438' }, // CFTR W1282X
  'rs334':       { chromosome: '11', position: '5246696'   }, // HBB sickle cell
  'rs63751763':  { chromosome: '11', position: '5246956'   }, // HBB beta-thal
  'rs80338748':  { chromosome: '15', position: '72638618'  }, // HEXA Tay-Sachs
  'rs5030858':   { chromosome: '12', position: '103241118' }, // PAH PKU
  'rs76763715':  { chromosome: '1',  position: '155205634' }, // GBA Gaucher N370S
  'rs80356773':  { chromosome: '1',  position: '155210508' }, // GBA L444P
  'rs9916':      { chromosome: '5',  position: '74641667'  }, // SMN1 proxy
  'rs76151636':  { chromosome: '13', position: '51937791'  }, // ATP7B Wilson's
  'rs1800562':   { chromosome: '6',  position: '26091179'  }, // HFE C282Y
  'rs1799945':   { chromosome: '6',  position: '26090951'  }, // HFE H63D
  'rs363050':    { chromosome: '4',  position: '3076604'   }, // HTT Huntington proxy
  'rs28942078':  { chromosome: '19', position: '11216171'  }, // LDLR FH
  'rs80357906':  { chromosome: '17', position: '41256099'  }, // BRCA1 185delAG
  'rs80357914':  { chromosome: '17', position: '41226488'  }, // BRCA1 5382insC
  'rs80358981':  { chromosome: '13', position: '32914782'  }, // BRCA2 6174delT
  'rs6025':      { chromosome: '1',  position: '169519049' }, // F5 Leiden
  'rs121913502': { chromosome: '15', position: '48762884'  }, // FBN1 Marfan
  'rs137852580': { chromosome: 'X',  position: '154064063' }, // F8 Hemophilia A
  'rs137852559': { chromosome: 'X',  position: '138624835' }, // F9 Hemophilia B
  'rs137852337': { chromosome: 'X',  position: '32867861'  }, // DMD
  'rs104894722': { chromosome: 'X',  position: '154158511' }, // OPN1LW Color Blind
  'rs29232':     { chromosome: 'X',  position: '147912051' }, // FMR1 Fragile X
  'rs1801133':   { chromosome: '1',  position: '11856378'  }, // MTHFR C677T
  'rs1801131':   { chromosome: '1',  position: '11854476'  }, // MTHFR A1298C
  'rs1799963':   { chromosome: '11', position: '46761055'  }, // F2 Prothrombin
}
