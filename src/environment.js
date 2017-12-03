export default {
  categories: [
    {
      id: 'transport',
      icon: 'transport'
    },
    {
      id: 'business',
      icon: 'business'
    },
    {
      id: 'science',
      icon: 'science'
    },
    {
      id: 'startup',
      icon: 'startup'
    },
    {
      id: 'handshake',
      icon: 'handshake'
    },
    {
      id: 'estate',
      icon: 'estate'
    },
    {
      id: 'socioeconomic',
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
          // eslint-disable-next-line
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
          // eslint-disable-next-line
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
      catId: 'transport'
    },
    {
      id: 'zeleznicni',
      title: 'Železniční',
      catId: 'transport'
    },
    {
      id: 'letecka',
      title: 'Letecká',
      catId: 'transport'
    },
    {
      id: 'vodni',
      title: 'Vodní',
      catId: 'transport'
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
      catId: 'business'
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
      catId: 'business'
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
      catId: 'business'
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
      catId: 'business'
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
      catId: 'business'
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
      catId: 'business'
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
      catId: 'business'
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
      catId: 'business'
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
      catId: 'business'
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
      catId: 'science'
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
      catId: 'science'
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
      catId: 'startup'
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
      catId: 'startup'
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
      catId: 'socioeconomic'
    }
  ]
};
