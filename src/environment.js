export default {
  categories: [
    {
      id: 'transport',
      icon: 'doprava'
    },
    {
      id: 'business',
      icon: 'site'
    },
    {
      id: 'science',
      icon: 'vvi'
    },
    {
      id: 'startup',
      icon: 'start'
    },
    {
      id: 'handshake',
      icon: 'podpora'
    },
    {
      id: 'estate',
      icon: 'nemovitosti'
    },
    {
      id: 'socioeconomic',
      icon: 'socio',
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
          // eslint-disable-next-line
          template: '<a target="_blank" href="${value}">${value}</a>'
        },
      ]
    },
    {
      id: 'pi_vtp',
      src: 'web-data/vzdelavani/pi_vtp.geojson',
      geometryType: 'point',
      attributes: [
        { property: 'name' },
        { property: 'address' },
        { property: 'type' },
        { property: 'services' },
        {
          property: 'url',
          type: 'html',
          // eslint-disable-next-line
          template: '<a target="_blank" href="${value}">${value}</a>'
        },
      ]
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
          // eslint-disable-next-line
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
      geometryType: 'point',
      attributes: [
        { property: 'name' },
        { property: 'contact' },
        { property: 'phone' },
        {
          property: 'email',
          type: 'html',
          // eslint-disable-next-line
          template: '<a href="mailto:${value}">${value}</a>'
        },
        { property: 'address' }
      ]
    },
    {
      id: 'brownfields',
      src: 'web-data/nemovitosti/brownfields.geojson',
      geometryType: 'point',
      attributes: [
        { property: 'name' },
        { property: 'btype' },
        { property: 'prev_usage' }
      ]
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
      geometryType: 'polygon',
      attributes: [
        { property: 'name' },
        {
          property: 'investice',
          type: 'map',
          map: {
            0: '100 milionů Kč',
            1: '50 milionů Kč'
          }
        },
        {
          property: 'granty',
          type: 'map',
          map: {
            0: '100 000 Kč na prac. místo, 25 % na školení',
            1: '200 000 Kč na prac. místo, 50 % na školení'
          }
        }
      ]
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
        icon: 'site_bod',
        fill: '#002E5F',
        // fill: [30,30,30,0.75],
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
        icon: 'site_bod',
        fill: '#DB002E',
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
        icon: 'site_bod',
        fill: '#475A8F',
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
        icon: 'site_bod',
        fill: '#7C88C3',
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
        icon: 'site_bod',
        fill: '#DD4A53',
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
        icon: 'site_bod',
        fill: '#EB7274',
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
        icon: 'site_bod',
        fill: '#D8A881',
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
        icon: 'site_bod',
        fill: '#F3914E',
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
        icon: 'site_bod',
        fill: '#DBC8BE',
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
        icon: 'site_bod',
        fill: '#CFAAB4'
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
        type: 'icon',
        icon: 'vvi_bod',
        fill: '#002E5F'
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
        type: 'icon',
        icon: 'vvi_bod',
        fill: '#DB002E'
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
        type: 'icon',
        icon: 'vvi_bod',
        fill: '#475A8F'
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
        type: 'icon',
        icon: 'vvi_bod',
        fill: '#7C88C3'
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
        type: 'icon',
        icon: 'vvi_bod',
        fill: '#DD4A53'
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
        type: 'icon',
        icon: 'vvi_bod',
        fill: '#EB7274'
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
        type: 'icon',
        icon: 'vvi_bod',
        fill: '#D8A881'
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
        type: 'icon',
        icon: 'vvi_bod',
        fill: '#F3914E'
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
        // type: 'icon',
        // icon: 'vvi_bod',
        fill: '#DCA28F'
      },
      catId: 'science'
    },
    {
      id: 'sskoly',
      datasetId: 'sskoly',
      visible: false,
      style: {
        type: 'icon',
        icon: 'vvi_bod',
        fill: '#CFAAB4'
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
        icon: 'vvi_bod',
        fill: '#F088A4'
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
        icon: 'vvi_bod',
        fill: '#fce94f'
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
        fill: '#9D9D9C'
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
        fill: '#EB7274'
      },
      catId: 'startup'
    },
    {
      id: 'coworking',
      datasetId: 'coworking',
      visible: false,
      style: {
        type: 'icon',
        icon: 'start_bod',
        fill: '#D8A881',
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
        icon: 'start_bod',
        fill: '#F3914E',
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
        icon: 'start_bod',
        fill: '#CFAAB4'
      },
      catId: 'startup'
    },
    {
      id: 'startupy',
      datasetId: 'startupy',
      visible: false,
      style: {
        type: 'icon',
        icon: 'start_bod',
        fill: '#475A8F'
      },
      catId: 'startup'
    },
    {
      id: 'rk',
      datasetId: 'rk',
      visible: false,
      style: {
        type: 'icon',
        icon: 'podpora_bod',
        fill: '#475A8F'
      },
      catId: 'handshake'
    },
    {
      id: 'investice',
      datasetId: 'orp',
      visible: false,
      filter: {
        attribute: 'investice',
        type: 'oneOf',
        values: [1, 0]
      },/*
      style: {
        type: 'categorized',
        fill: ['#7C88C377', '#DD4A53'],
        stroke: 'red'
      },*/
      style: [
        {
          label: '50 milionů Kč',
          fill: ['#475A8F', 0.7],
          stroke: 'red'
        },
        {
          label: '100 milionů Kč',
          fill: ['#002E5F99', 0.7],
          stroke: 'red'
        }
      ],
      catId: 'handshake'
    },
    {
      id: 'granty',
      datasetId: 'orp',
      visible: false,
      filter: {
        attribute: 'granty',
        type: 'oneOf',
        values: [0, 1]
      },
      style: [
        {
          label: '100 000 Kč na prac. místo, 25 % na školení',
          fill: ['#DD4A53', 0.7],
          stroke: 'red'
        },
        {
          label: '200 000 Kč na prac. místo, 50 % na školení',
          fill: ['#DB002E', 0.7],
          stroke: 'red'
        }
      ],
      catId: 'handshake'
    },
    {
      id: 'brownfields',
      datasetId: 'brownfields',
      visible: false,
      style: {
        type: 'icon',
        icon: 'nemovitosti_bod',
        fill: [62,39,35 ,0.8]
      },
      catId: 'estate'
    },
    {
      id: 'kraje',
      title: 'Kraje',
      datasetId: 'kraje',
      visible: false,
      style: {
        fill: [255,255,255,0.25],
        stroke: [0, 47, 96, 0.4],
        strokeWidth: 1.75
      },
      catId: 'socioeconomic'
    }
  ]
};
