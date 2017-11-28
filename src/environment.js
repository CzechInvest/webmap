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
  datasets: [
    {
      id: 'dodavatele',
      title: 'Dodavatele',
      src: 'web-data/podnikatelska_sit/dodavatele.geojson',
      geometryType: 'point',
      attributes: []
    },
    {
      id: 'pi_vtp',
      src: 'web-data/vzdelavani/pi_vtp.geojson',
      geometryType: 'point'
    },
    {
      id: 'whoiswho',
      src: 'web-data/vzdelavani/whoiswho.geojson',
      geometryType: 'point',
    },
    {
      id: 'coworking',
      src: 'web-data/startup/coworking.geojson',
      geometryType: 'point',
      attributes: [
        {
          property: 'name',
          label: 'Název'
        },
        {
          property: 'address',
          label: 'Adresa'
        },
        {
          property: 'url',
          label: 'Url',
          type: 'html',
          template: '<a target="_blank" href="${value}">${value}</a>'
        }
      ],
    },
    {
      id: 'sub_bic',
      src: 'web-data/startup/sub_bic.geojson',
      geometryType: 'point'
    },
    {
      id: 'kraje',
      src: 'web-data/socioekonomicka/kraje.pbf',
      geometryType: 'polygon',
      attributes: [
        {
          property: 'Nazev',
          label: 'Název'
        },
        {
          property: 'Populace',
          type: 'number',
          format: ['cs-CZ', {style: 'decimal'}]
        },
        {
          property: 'Pracovní_síla',
          label: 'Pracovní síla',
          type: 'number',
          format: ['cs-CZ', {style: 'decimal'}]
        },
        {
          property: 'Počet_nezam',
          label: 'Počet nezam.',
          type: 'number',
          format: ['cs-CZ', {style: 'decimal'}]
        },
        {
          property: 'Míra_nezam',
          label: 'Míra nezam.',
          type: 'number',
          format: ['cs-CZ', {style: 'decimal', maximumFractionDigits: 2}]
        },
        {
          property: 'Počet_nezam_na_prac_místo',
          label: 'Počet nezam. na prac místo',
          type: 'number',
          format: ['cs-CZ', {style: 'decimal', maximumFractionDigits: 2}]
        },
        {
          property: 'Mzdy',
          type: 'number',
          template: '${value} Kč',
          format: ['cs-CZ', {style: 'decimal', maximumFractionDigits: 0}],
          xformat: ['cs-CZ', {style: 'currency', currency: 'CZK'}]
        }
      ],
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
      id: 'automobilovy_prumysl',
      title: 'Automobilový průmysl',
      datasetId: 'dodavatele',
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
      id: 'letecky_prumysl',
      title: 'Letecký průmysl',
      datasetId: 'dodavatele',
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
      id: 'elektronika',
      title: 'Elektronika a elektrotechnika',
      datasetId: 'dodavatele',
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
      id: 'energetika',
      title: 'Energetika',
      datasetId: 'dodavatele',
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
      id: 'ict',
      title: 'ICT Informační a komunikační',
      datasetId: 'dodavatele',
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
      id: 'zpracovani_kovu',
      title: 'Zpracování kovů',
      datasetId: 'dodavatele',
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
      id: 'strojirenstvi',
      title: 'Strojírenství',
      datasetId: 'dodavatele',
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
      id: 'zdravotnictvo',
      title: 'Zdravotnická technika, biotechnologie a farmaceutický průmysl',
      datasetId: 'dodavatele',
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
      id: 'top10',
      title: '10 největších firem podle sektorů',
      datasetId: 'dodavatele',
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
      datasetId: 'pi_vtp',
      visible: false,
      style: {
        type: 'circle',
        fill: '#7B1FA2'
      },
      catId: 2
    },
    {
      id: 'whoiswho',
      title: 'Who is Who',
      datasetId: 'whoiswho',
      visible: false,
      style: {
        type: 'circle',
        fill: [255,193,7, 0.7]
      },
      catId: 2
    },
    {
      id: 'coworking',
      title: 'Coworking',
      datasetId: 'coworking',
      visible: true,
      style: {
        type: 'circle',
        fill: '#AFB42B',
        label: 'name'
      },
      catId: 3
    },
    {
      id: 'sub_bic',
      title: 'ESA BIC SUPy',
      datasetId: 'sub_bic',
      visible: false,
      style: {
        type: 'circle',
        fill: '#FF3D00'
      },
      catId: 3
    },
    {
      id: 'kraje',
      title: 'Kraje',
      datasetId: 'kraje',
      visible: true,
      style: {
        fill: [255,255,255,0.25],
        stroke: 'red'
      },
      catId: 6
    }
  ]
};
