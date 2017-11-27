export default {
  categories: [
    {
      id: 0,
      title: 'Doprava',
      icon: 'transport'
    },
    {
      id: 1,
      title: 'Podnik. sítě',
      icon: 'business'
    },
    {
      id: 2,
      title: 'VVI & Vzdělání',
      icon: 'science'
    },
    {
      id: 3,
      title: 'Start Up',
      icon: 'startup'
    },
    {
      id: 4,
      title: 'Veř. Podpora',
      icon: 'handshake'
    },
    {
      id: 5,
      title: 'Nemovitosti',
      icon: 'estate'
    },
    {
      id: 6,
      title: 'Socioekonom.',
      icon: 'socioeconomic',
    }
  ],
  layers: [
    {
      id: 'silnicni',
      title: 'Silniční',
      catId: 0
    },
    {
      id: 'zeleznicni',
      title: 'Železniční',
      catId: 0
    },
    {
      id: 'letecka',
      title: 'Letecká',
      catId: 0
    },
    {
      id: 'vodni',
      title: 'Vodní',
      catId: 0
    },
    {
      id: 'dodavatele:automobilovy_prumysl',
      title: 'Automobilový průmysl',
      source: 'web-data/podnikatelska_sit/dodavatele.geojson',
      type: 'point',
      filter: {
        attribute: 'sectors',
        value: 'Automobilový průmysl'
      },
      visible: true,
      style: {
        fill: [30,30,30,0.7],
        label: 'name'
      },
      catId: 1
    },
    {
      id: 'dodavatele:letecky_prumysl',
      title: 'Letecký průmysl',
      filter: {
        attribute: 'sectors',
        value: 'Letecký průmysl'
      },
      visible: true,
      style: {
        fill: [41,182,246,0.7],
        label: 'name'
      },
      catId: 1
    },
    {
      id: 'dodavatele:elektronika',
      title: 'Elektronika a elektrotechnika',
      filter: {
        attribute: 'sectors',
        value: 'Elektronika a elektrotechnika'
      },
      visible: false,
      style: {
        fill: [150,50,30,0.7],
        label: 'name'
      },
      catId: 1
    },
    {
      id: 'dodavatele:energetika',
      title: 'Energetika',
      filter: {
        attribute: 'sectors',
        value: 'Energetika'
      },
      visible: false,
      style: {
        fill: [80,50,200,0.7],
        label: 'name'
      },
      catId: 1
    },
    {
      id: 'dodavatele:ict',
      title: 'ICT Informační a komunikační',
      filter: {
        attribute: 'sectors',
        value: 'ICT Informační a komunikační technologie'
      },
      visible: false,
      style: {
        fill: [255,235,59,0.7],
        label: 'name'
      },
      catId: 1
    },
    {
      id: 'dodavatele:zpracovani_kovu',
      title: 'Zpracování kovů',
      filter: {
        attribute: 'sectors',
        value: 'Zpracování kovů'
      },
      visible: false,
      style: {
        fill: [180,70,100,0.7],
        label: 'name'
      },
      catId: 1
    },
    {
      id: 'dodavatele:strojirenstvi',
      title: 'Strojírenství',
      filter: {
        attribute: 'sectors',
        value: 'Strojírenství'
      },
      visible: false,
      style: {
        fill: [244,81,30,0.7],
        label: 'name'
      },
      catId: 1
    },
    {
      id: 'dodavatele:zdravotnictvo',
      title: 'Zdravotnická technika, biotechnologie a farmaceutický průmysl',
      filter: {
        attribute: 'sectors',
        value: 'Zdravotnická technika - biotechnologie a farmaceutický průmysl'
      },
      visible: false,
      style: {
        fill: [124,179,66,0.7]
      },
      catId: 1
    },
    {
      id: 'dodavatele:top10',
      title: '10 největších firem podle sektorů',
      filter: {
        attribute: 'sectors',
        value: '10 největších firem podle sektorů'
      },
      visible: false,
      style: {
        fill: [100,100,30,0.7]
      },
      catId: 1
    },

    {
      id: 'pi_vtp',
      title: 'VTParky ',
      source: 'web-data/vzdelavani/pi_vtp.geojson',
      type: 'point',
      visible: false,
      style: {
        fill: '#7B1FA2'
      },
      catId: 2
    },
    {
      id: 'whoiswho',
      title: 'Who is Who',
      source: 'web-data/vzdelavani/whoiswho.geojson',
      type: 'point',
      visible: false,
      style: {
        fill: [255,193,7, 0.7]
      },
      catId: 2
    },
    {
      id: 'coworking',
      title: 'Coworking',
      source: 'web-data/startup/coworking.geojson',
      type: 'point',
      visible: true,
      style: {
        fill: '#AFB42B',
        label: 'name'
      },
      catId: 3
    },
    {
      id: 'sub_bic',
      title: 'ESA BIC SUPy',
      source: 'web-data/startup/sub_bic.geojson',
      visible: false,
      style: {
        fill: '#FF3D00'
      },
      catId: 3
    },
    {
      id: 'kraje',
      title: 'Kraje',
      source: 'web-data/socioekonomicka/kraje.pbf',
      type: 'polygon',
      visible: false,
      style: {
        fill: [255,255,255,0.25],
        stroke: 'red'
      },
      catId: 6
    }
  ]
};
