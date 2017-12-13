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
      id: 'airports',
      src: 'web-data/doprava/airports.geojson',
      // geometryType: 'polygon'
    },
    {
      id: 'ferry',
      src: 'web-data/doprava/ferry.geojson',
      geometryType: 'point'
    },
    {
      id: 'rail',
      src: 'web-data/doprava/rail.pbf.geojson',
      geometryType: 'line'
    },
    {
      id: 'highway',
      src: 'web-data/doprava/highway.pbf.geojson',
      geometryType: 'line'
    },
    {
      id: 'silnice_1tr',
      src: 'web-data/doprava/primary.pbf.geojson',
      geometryType: 'line'
    },
    {
      id: 'silnice_2tr',
      src: 'web-data/doprava/secondary.pbf.geojson',
      geometryType: 'line'
    },
    {
      id: 'dodavatele',
      title: 'Dodavatele',
      src: 'web-data/podnikatelska_sit/dodavatele.geojson',
      geometryType: 'point',
      attributes: [
        { property: 'name' },
        { property: 'address' },
        { property: 'sectors' },
        {
          property: 'url',
          type: 'html',
          template: '<a target="_blank" href="${value}">${value}</a>'
        },
      ]
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
      attributes: [
        { property: 'name' },
        { property: 'address' },
        { property: 'sectors' },
        { property: 'specialization' },
        {
          property: 'url',
          type: 'html',
          template: '<a target="_blank" href="${value}">${value}</a>'
        }
      ]
    },
    {
      id: 'coworking',
      src: 'web-data/startup/coworking.geojson',
      geometryType: 'point',
      attributes: [
        { property: 'name' },
        { property: 'address' },
        {
          property: 'url',
          type: 'html',
          // eslint-disable-next-line
          template: '<a target="_blank" href="${value}">${value}</a>'
        }
      ],
    },
    {
      id: 'sub_bic',
      src: 'web-data/startup/sub_bic.geojson',
      geometryType: 'point',
      attributes: [
        { property: 'name' },
        { property: 'address' },
        {
          property: 'url',
          type: 'html',
          // eslint-disable-next-line
          template: '<a target="_blank" href="${value}">${value}</a>'
        }
      ]
    },
    {
      id: 'kraje',
      src: 'web-data/socioekonomicka/kraje.pbf.geojson',
      geometryType: 'polygon',
      attributes: [
        { property: 'Nazev' },
        {
          property: 'Populace',
          type: 'number',
          format: ['cs-CZ', {style: 'decimal'}]
        },
        {
          property: 'Pracovní_síla',
          type: 'number',
          format: ['cs-CZ', {style: 'decimal'}]
        },
        {
          property: 'Počet_nezam',
          type: 'number',
          format: ['cs-CZ', {style: 'decimal'}]
        },
        {
          property: 'Míra_nezam',
          type: 'number',
          format: ['cs-CZ', {style: 'decimal', maximumFractionDigits: 2}]
        },
        {
          property: 'Počet_nezam_na_prac_místo',
          type: 'number',
          format: ['cs-CZ', {style: 'decimal', maximumFractionDigits: 2}]
        },
        {
          property: 'Mzdy',
          type: 'number',
          // eslint-disable-next-line
          template: '${value} Kč',
          format: ['cs-CZ', {style: 'decimal', maximumFractionDigits: 0}]
        }
      ],
    },
    {
      id: 'pz',
      src: 'web-data/verejna_podpora/pz.geojson',
      geometryType: 'point'
    },
    {
      id: 'rk',
      src: 'web-data/rk/reg_offices.geojson',
      geometryType: 'point'
    },
    {
      id: 'business_angels',
      src: 'web-data/startup/business_angels.geojson',
      geometryType: 'point',
      attributes: [
        { property: 'name' },
        { property: 'address' },
        { property: 'description' },
        { property: 'topics' }
      ]
    },
    {
      id: 'startupy',
      src: 'web-data/startup/startupy.geojson',
      geometryType: 'point',
      attributes: [
        { property: 'name' },
        { property: 'address' },
        {
          property: 'url',
          type: 'html',
          // eslint-disable-next-line
          template: '<a target="_blank" href="${value}">${value}</a>'
        }
      ]
    },
    {
      id: 'orp',
      src: 'web-data/verejna_podpora/orp.pbf.geojson',
      geometryType: 'polygon'
    },
    {
      id: 'sskoly',
      src: 'web-data/vzdelavani/sskoly.geojson',
      geometryType: 'point',
      attributes: [
        { property: 'name' },
        { property: 'address' }
      ]
    },
    {
      id: 'vskoly',
      src: 'web-data/vzdelavani/vskoly.geojson',
      geometryType: 'point',
      attributes: [
        { property: 'name' },
        { property: 'vtype' },
        { property: 'form' },
        { property: 'address' },
        {
          property: 'url',
          type: 'html',
          // eslint-disable-next-line
          template: '<a target="_blank" href="${value}">${value}</a>'
        }
      ]
    }
  ],
  layers: [
    {
      id: 'letecka',
      datasetId: 'airports',
      visible: true,
      style: {
        type: 'icon',
        icon: 'airport',
        fill: '#607D8B'
      },
      catId: 'transport'
    },
    {
      id: 'vodni',
      datasetId: 'ferry',
      visible: true,
      style: {
        type: 'icon',
        icon: 'harbor',
        fill: '#64B5F6'
      },
      catId: 'transport'
    },
    {
      id: 'zeleznicni',
      datasetId: 'rail',
      style: {
        stroke: '#999',
        strokeWidth: 2
      },
      catId: 'transport'
    },
    {
      id: 'highway',
      datasetId: 'highway',
      visible: false,
      style: {
        stroke: [251,140,0, 0.8],
        strokeWidth: 3
      },
      catId: 'transport'
    },
    {
      id: 'silnice_1tr',
      datasetId: 'silnice_1tr',
      visible: false,
      style: {
        stroke: [255,193,7 ,0.8],
        strokeWidth: 2
      },
      catId: 'transport'
    },
    {
      id: 'silnice_2tr',
      datasetId: 'silnice_2tr',
      visible: false,
      style: {
        stroke: [255,235,59, 0.75]
      },
      catId: 'transport'
    },

    {
      id: 'automobilovy_prumysl',
      datasetId: 'dodavatele',
      filter: {
        attribute: 'sectors',
        value: 'Automobilový průmysl'
      },
      visible: false,
      style: {
        type: 'icon',
        icon: 'business_point',
        fill: [30,30,30,0.75],
        label: 'name'
      },
      catId: 'business'
    },
    {
      id: 'letecky_prumysl',
      datasetId: 'dodavatele',
      filter: {
        attribute: 'sectors',
        value: 'Letecký průmysl'
      },
      visible: false,
      style: {
        type: 'icon',
        icon: 'business_point',
        fill: [41,182,246,0.8],
        label: 'name'
      },
      catId: 'business'
    },
    {
      id: 'elektronika',
      datasetId: 'dodavatele',
      filter: {
        attribute: 'sectors',
        value: 'Elektronika a elektrotechnika'
      },
      visible: false,
      style: {
        type: 'icon',
        icon: 'business_point',
        fill: [150,50,30,0.8],
        label: 'name'
      },
      catId: 'business'
    },
    {
      id: 'energetika',
      datasetId: 'dodavatele',
      filter: {
        attribute: 'sectors',
        value: 'Energetika'
      },
      visible: false,
      style: {
        type: 'icon',
        icon: 'business_point',
        fill: [80,50,200,0.8],
        label: 'name'
      },
      catId: 'business'
    },
    {
      id: 'ict',
      datasetId: 'dodavatele',
      filter: {
        attribute: 'sectors',
        value: 'ICT Informační a komunikační technologie'
      },
      visible: false,
      style: {
        type: 'icon',
        icon: 'business_point',
        fill: [255,235,59,0.8],
        label: 'name'
      },
      catId: 'business'
    },
    {
      id: 'zpracovani_kovu',
      datasetId: 'dodavatele',
      filter: {
        attribute: 'sectors',
        value: 'Zpracování kovů'
      },
      visible: false,
      style: {
        type: 'icon',
        icon: 'business_point',
        fill: [180,70,100,0.8],
        label: 'name'
      },
      catId: 'business'
    },
    {
      id: 'vyroba_plastovych_vylisku',
      datasetId: 'dodavatele',
      filter: {
        attribute: 'sectors',
        value: 'Výroba plastových výlisků a pryže'
      },
      visible: false,
      style: {
        type: 'icon',
        icon: 'business_point',
        fill: [93,64,55,0.8],
        label: 'name'
      },
      catId: 'business'
    },
    {
      id: 'strojirenstvi',
      datasetId: 'dodavatele',
      filter: {
        attribute: 'sectors',
        value: 'Strojírenství'
      },
      visible: false,
      style: {
        type: 'icon',
        icon: 'business_point',
        fill: [244,81,30,0.8],
        label: 'name'
      },
      catId: 'business'
    },
    {
      id: 'materialy_a_obaly',
      datasetId: 'dodavatele',
      filter: {
        attribute: 'sectors',
        value: 'Materiály a obaly'
      },
      visible: false,
      style: {
        type: 'icon',
        icon: 'business_point',
        fill: [245,0,87,0.8],
        label: 'name'
      },
      catId: 'business'
    },
    {
      id: 'zdravotnictvo',
      datasetId: 'dodavatele',
      filter: {
        attribute: 'sectors',
        value: 'Zdravotnická technika - biotechnologie a farmaceutický průmysl'
      },
      visible: false,
      style: {
        type: 'icon',
        icon: 'business_point',
        fill: [124,179,66,0.8]
      },
      catId: 'business'
    },
    {
      id: 'whoiswho_ht',
      datasetId: 'whoiswho',
      visible: true,
      filter: {
        attribute: 'sectors',
        value: 'HT'
      },
      style: {
        fill: [239,108,0, 0.8]
      },
      catId: 'science'
    },
    {
      id: 'whoiswho_ae',
      datasetId: 'whoiswho',
      visible: false,
      filter: {
        attribute: 'sectors',
        value: 'AE'
      },
      style: {
        fill: [100,100,30, 0.8]
      },
      catId: 'science'
    },
    {
      id: 'whoiswho_au',
      datasetId: 'whoiswho',
      visible: false,
      filter: {
        attribute: 'sectors',
        value: 'AU'
      },
      style: {
        fill: [57,73,171, 0.8]
      },
      catId: 'science'
    },
    {
      id: 'whoiswho_bi',
      datasetId: 'whoiswho',
      visible: false,
      filter: {
        attribute: 'sectors',
        value: 'BI'
      },
      style: {
        fill: [118,255,3, 0.8]
      },
      catId: 'science'
    },
    {
      id: 'whoiswho_it',
      datasetId: 'whoiswho',
      visible: false,
      filter: {
        attribute: 'sectors',
        value: 'IT'
      },
      style: {
        fill: [233,30,99, 0.8]
      },
      catId: 'science'
    },
    {
      id: 'whoiswho_nn',
      datasetId: 'whoiswho',
      visible: false,
      filter: {
        attribute: 'sectors',
        value: 'NN'
      },
      style: {
        fill: [0,229,255, 0.8]
      },
      catId: 'science'
    },
    {
      id: 'whoiswho_ee',
      datasetId: 'whoiswho',
      visible: false,
      filter: {
        attribute: 'sectors',
        value: 'EE'
      },
      style: {
        fill: [142,36,170, 0.8]
      },
      catId: 'science'
    },
    {
      id: 'whoiswho_ct',
      datasetId: 'whoiswho',
      visible: false,
      filter: {
        attribute: 'sectors',
        value: 'CT'
      },
      style: {
        fill: [255,234,0, 0.8]
      },
      catId: 'science'
    },
    {
      id: 'vtp',
      datasetId: 'pi_vtp',
      visible: false,
      filter: {
        attribute: 'type',
        value: 'vtp'
      },
      style: {
        fill: '#7B1FA2'
      },
      catId: 'science'
    },
    {
      id: 'sskoly',
      datasetId: 'sskoly',
      visible: false,
      style: {
        type: 'icon',
        icon: 'science',
        fill: [0,150,136 ,0.85]
      },
      catId: 'science'
    },
    {
      id: 'vskoly_univerzitni',
      datasetId: 'vskoly',
      visible: false,
      filter: {
        type: 'single',
        attribute: 'vtype',
        value: 'univerzitní'
      },
      style: {
        type: 'icon',
        icon: 'science_point',
        fill: [124,179,66 ,0.85]
      },
      catId: 'science'
    },
    {
      id: 'vskoly_neuniverzitni',
      datasetId: 'vskoly',
      visible: false,
      filter: {
        type: 'single',
        attribute: 'vtype',
        value: 'neuniverzitní'
      },
      style: {
        type: 'icon',
        icon: 'science_point',
        fill: [255,50,66 ,0.85]
      },
      catId: 'science'
    },
    {
      id: 'incubators',
      datasetId: 'pi_vtp',
      visible: false,
      filter: {
        attribute: 'type',
        value: 'incubator'
      },
      style: {
        fill: '#7B1FA2'
      },
      catId: 'startup'
    },
    {
      id: 'accelerators',
      datasetId: 'pi_vtp',
      visible: false,
      filter: {
        attribute: 'type',
        value: 'accelerator'
      },
      style: {
        fill: '#307050'
      },
      catId: 'startup'
    },
    {
      id: 'coworking',
      datasetId: 'coworking',
      visible: false,
      style: {
        type: 'icon',
        icon: 'startup',
        fill: '#AFB42B',
        label: 'name'
      },
      catId: 'startup'
    },
    {
      id: 'business_angels',
      datasetId: 'business_angels',
      visible: false,
      style: {
        type: 'icon',
        icon: 'startup',
        fill: '#E91E63',
        label: 'name'
      },
      catId: 'startup'
    },
    {
      id: 'sub_bic',
      datasetId: 'sub_bic',
      visible: false,
      style: {
        type: 'icon',
        icon: 'startup',
        fill: '#F57C00'
      },
      catId: 'startup'
    },
    {
      id: 'startupy',
      datasetId: 'startupy',
      visible: false,
      style: {
        type: 'icon',
        icon: 'startup_point',
        fill: '#795548'
      },
      catId: 'startup'
    },
    {
      id: 'rk',
      datasetId: 'rk',
      visible: false,
      style: {
        type: 'icon',
        icon: 'handshake',
        fill: '#d50000'
      },
      catId: 'handshake'
    },
    {
      id: 'investice',
      datasetId: 'orp',
      visible: false,
      style: {
        fill: '#0097A7'
      },
      catId: 'handshake'
    },
    {
      id: 'granty',
      datasetId: 'orp',
      visible: false,
      style: {
        fill: '#689F38'
      },
      catId: 'handshake'
    },
    {
      id: 'kraje',
      title: 'Kraje',
      datasetId: 'kraje',
      visible: false,
      style: {
        fill: [255,255,255,0.25],
        stroke: 'red'
      },
      catId: 'socioeconomic'
    }
  ]
};
