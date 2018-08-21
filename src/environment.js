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
      id: 'pasport',
      icon: 'pasport',
      selectType: 'radio'
    },
    {
      id: 'socioeconomic',
      icon: 'socio',
      selectType: 'radio'
    }
  ],
  datasets: [
    {
      id: 'airports',
      src: 'doprava/airports.geojson',
      geometryType: 'point',
      attributes: [
        { property: 'name' },
        { property: 'icao' },
        { property: 'iata' },
        {
          property: 'url',
          type: 'html',
          // eslint-disable-next-line
          template: '<a target="_blank" href="${value}">${value}</a>'
        },
      ]
    },
    {
      id: 'ferry',
      src: 'doprava/ferry.geojson',
      geometryType: 'point',
      attributes: [
        { property: 'name' }
      ]
    },
    {
      id: 'rail',
      src: 'doprava/rail.pbf.geojson',
      geometryType: 'line'
    },
    {
      id: 'highway',
      src: 'doprava/highway.pbf.geojson',
      geometryType: 'line'
    },
    {
      id: 'silnice_1tr',
      src: 'doprava/primary.pbf.geojson',
      geometryType: 'line'
    },
    {
      id: 'silnice_2tr',
      src: 'doprava/secondary.pbf.geojson',
      geometryType: 'line'
    },
    {
      id: 'dodavatele',
      src: 'podnikatelska_sit/dodavatele.geojson',
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
      src: 'vzdelavani/pi_vtp.geojson',
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
      src: 'vzdelavani/whoiswho.geojson',
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
        }
      ]
    },
    {
      id: 'coworking',
      src: 'startup/coworking.geojson',
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
      src: 'startup/sub_bic.geojson',
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
      // src: 'socioekonomicka/kraje.pbf.geojson',
      src: {
        geometry: 'geometry/kraje.geojson',
        attributes: 'socioekonomicka/soc_ekon-kraje.json',
        geometryId: 'Kod',
        attributesId: 'Kod'
      },
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
      src: 'verejna_podpora/pz.geojson',
      geometryType: 'point'
    },
    {
      id: 'rk',
      src: 'rk/reg_offices.geojson',
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
      src: 'nemovitosti/brownfields.geojson',
      geometryType: 'point',
      attributes: [
        { property: 'name' },
        { property: 'btype' },
        { property: 'prev_usage' },
        { property: 'new_usage' },
        { property: 'area' },
        { property: 'ecology' },
        { property: 'ownership' }
      ]
    },
    {
      id: 'business_angels',
      src: 'startup/business_angels.geojson',
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
      src: 'startup/startupy.geojson',
      geometryType: 'point',
      attributes: [
        { property: 'name' },
        { property: 'program' },
        { property: 'address' },
        { property: 'place_of_business' },
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
      src: {
        geometry: 'geometry/orp.pbf.geojson',
        attributes: 'verejna_podpora/verejna_podpora.json',
        geometryId: 'Kod',
        attributesId: 'Kod'
      },
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
      id: 'okresy',
      src: {
        geometry: 'geometry/okresy.pbf.geojson',
        attributes: 'socioekonomicka/soc_ekon-okresy.json',
        geometryId: 'Kod',
        attributesId: 'Kod'
      },
      geometryType: 'polygon',
      attributes: [
        { property: 'Nazev' },
        {
          property: 'Populace-okr',
          type: 'number',
          format: ['cs-CZ', {style: 'decimal'}]
        },
        {
          property: 'Prac_síla-okr',
          type: 'number',
          format: ['cs-CZ', {style: 'decimal'}]
        },
        {
          property: 'Počet_nezam-okr',
          type: 'number',
          format: ['cs-CZ', {style: 'decimal'}]
        },
        {
          property: 'Míra_nezam-okr',
          type: 'number',
          format: ['cs-CZ', {style: 'decimal', maximumFractionDigits: 2}]
        },
        {
          property: 'Počet_nezam_na_1_PM-okr',
          type: 'number',
          format: ['cs-CZ', {style: 'decimal', maximumFractionDigits: 2}]
        }
      ],
    },
    {
      id: 'kindergardens',
      src: 'vzdelavani/kindergardens.geojson',
      geometryType: 'point',
      attributes: [
        { property: 'name' },
        { property: 'address' }
      ]
    },
    {
      id: 'primary_schools',
      src: 'vzdelavani/primary_schools.geojson',
      geometryType: 'point',
      attributes: [
        { property: 'name' },
        { property: 'address' }
      ]
    },
    {
      id: 'sskoly',
      src: 'vzdelavani/sskoly.geojson',
      geometryType: 'point',
      attributes: [
        { property: 'name' },
        { property: 'address' }
      ]
    },
    {
      id: 'vskoly',
      src: 'vzdelavani/vskoly.geojson',
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
    },
    {
      id: 'pasport',
      src: {
        geometry: 'geometry/orp.pbf.geojson',
        attributes: 'pasporty/assets.json',
        geometryId: 'Kod',
        attributesId: 'kod'
      },
      geometryType: 'polygon',
      attributes: [
        { property: 'Nazev' },
        { property: 'contact' },
        {
          property: 'mail',
          type: 'html',
          // eslint-disable-next-line
          template: '<a href="mailto:${value}">${value}</a>'
        },
        {
          property: 'inhabitans',
          type: 'number',
          format: ['cs-CZ', {style: 'decimal'}]
        },
        {
          property: 'inhabitans_orp',
          type: 'number',
          format: ['cs-CZ', {style: 'decimal'}]
        },
        {
          property: 'airport_distance',
          type: 'number',
          format: ['cs-CZ', {style: 'decimal'}]
        },
        {
          property: 'highway_distance',
          type: 'number',
          format: ['cs-CZ', {style: 'decimal'}]
        },
        {
          property: 'brownfields',
          type: 'number',
          format: ['cs-CZ', {style: 'decimal'}]
        },
        {
          property: 'greenfields',
          type: 'number',
          format: ['cs-CZ', {style: 'decimal'}]
        },
        {
          property: 'size_for_living',
          type: 'number',
          format: ['cs-CZ', {style: 'decimal'}]
        },
        {
          property: 'flat_planned',
          type: 'number',
          format: ['cs-CZ', {style: 'decimal'}]
        },
        {
          property: 'prepared_for_living',
          type: 'boolean',
        },
        {
          property: 'professions_disponibility',
          type: 'number',
          format: ['cs-CZ', {style: 'decimal', maximumFractionDigits: 3}]
        },
        {
          property: 'technical_workers_disponibility',
          type: 'number',
          format: ['cs-CZ', {style: 'decimal', maximumFractionDigits: 3}]
        },
        {
          property: 'services_disponibility',
          type: 'number',
          format: ['cs-CZ', {style: 'decimal', maximumFractionDigits: 3}]
        },
        {
          property: 'reparers_disponibility',
          type: 'number',
          format: ['cs-CZ', {style: 'decimal', maximumFractionDigits: 3}]
        },
        {
          property: 'machine_service_disponibility',
          type: 'number',
          format: ['cs-CZ', {style: 'decimal', maximumFractionDigits: 3}]
        },
        {
          property: 'tradition_spec',
        },
        {
          property: 'city_strategy',
          type: 'boolean',
        },
        {
          property: 'financial_business_support',
          type: 'boolean',
        },
        {
          property: 'business_web',
          type: 'boolean',
        },
        {
          property: 'personal_consultant',
        },
        {
          property: 'regural_meetings',
          type: 'boolean',
        },
        {
          property: 'decision_involvement',
          type: 'boolean',
        }
      ],
      groups: {
        basic_info: [
          'contact',
          'mail',
          'inhabitans',
          'inhabitans_orp',
          'airport_distance',
          'highway_distance'
        ],
        technical_infrastructure: [
          'brownfields',
          'greenfields'
        ],
        social_infrastructure: [
          'size_for_living',
          'flat_planned',
          'prepared_for_living'
        ],
        kps: [
          'professions_disponibility',
          'technical_workers_disponibility',
          'services_disponibility',
          'reparers_disponibility',
          'machine_service_disponibility'
        ],
        business_cooperation: [
          'tradition_spec',
          'city_strategy',
          'financial_business_support',
          'business_web',
          'personal_consultant',
          'regural_meetings',
          'decision_involvement'
        ]
      }
    },
    {
      id: 'top_investments',
      src: 'podnikatelska_sit/top_investice.geojson',
      geometryType: 'point',
      attributes: [
        { property: 'name' },
        { property: 'sector' },
        { property: 'origin' },
        { property: 'investment' },
        { property: 'places' },
        { property: 'year' },
        { property: 'target' }
      ]
    },
    {
      id: 'avcr',
      src: 'vzdelavani/avcr.geojson',
      geometryType: 'point',
      attributes: [
        { property: 'name' },
        { property: 'scope' },
        { property: 'address' }
      ]
    }
  ],
  layers: [
    {
      id: 'letecka',
      datasetId: 'airports',
      visible: false,
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
      visible: false,
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
      identifiable: false,
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
      identifiable: false,
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
      identifiable: false,
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
      identifiable: false,
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
      id: 'top_investments',
      datasetId: 'top_investments',
      visible: false,
      style: {
        type: 'categorized',
        attribute: 'kraj',
        base: {
          type: 'circle',
          fill: '#aaa',
          stroke: '#333',
          strokeWidth: 1
        },
        categories: [
          {
            value: 19,
            fill: '#002E5F'
          }, {
            value: 27,
            fill: '#DB002E'
          }, {
            value: 35,
            fill: '#DCA28F'
          }, {
            value: 43,
            fill: '#7C88C3'
          }, {
            value: 51,
            fill: '#DD4A53'
          }, {
            value: 60,
            fill: '#EB7274'
          }, {
            value: 78,
            fill: '#D8A881'
          }, {
            value: 86,
            fill: '#F3914E'
          }, {
            value: 94,
            fill: '#FCE94F'
          }, {
            value: 108,
            fill: '#75507B'
          }, {
            value: 116,
            fill: '#73D216'
          }, {
            value: 124,
            fill: '#CFAAB4'
          }, {
            value: 132,
            fill: '#475A8F'
          }, {
            value: 141,
            fill: '#F088A4'
          }
        ]
      },
      catId: 'business'
    },
    {
      id: 'avcr',
      datasetId: 'avcr',
      visible: false,
      style: {
        type: 'icon',
        icon: 'vvi_bod',
        fill: '#002E5F'
      },
      catId: 'science'
    },
    {
      id: 'whoiswho_ht',
      datasetId: 'whoiswho',
      visible: false,
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
        type: 'icon',
        icon: 'vvi_bod',
        anchor: [0.3, 0.95],
        fill: '#DCA28F'
      },
      catId: 'science'
    },
    {
      id: 'kindergardens',
      datasetId: 'kindergardens',
      visible: false,
      style: {
        type: 'icon',
        icon: 'vvi_bod',
        fill: '#75507B'
      },
      catId: 'science'
    },
    {
      id: 'primary_schools',
      datasetId: 'primary_schools',
      visible: false,
      style: {
        type: 'icon',
        icon: 'vvi_bod',
        fill: '#73D216'
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
    // {
    //   id: 'vskoly_univerzitni',
    //   datasetId: 'vskoly',
    //   visible: false,
    //   filter: {
    //     type: 'single',
    //     attribute: 'vtype',
    //     value: 'univerzitní'
    //   },
    //   style: {
    //     type: 'icon',
    //     icon: 'vvi_bod',
    //     fill: '#F088A4'
    //   },
    //   catId: 'science'
    // },
    // {
    //   id: 'vskoly_neuniverzitni',
    //   datasetId: 'vskoly',
    //   visible: false,
    //   filter: {
    //     type: 'single',
    //     attribute: 'vtype',
    //     value: 'neuniverzitní'
    //   },
    //   style: {
    //     type: 'icon',
    //     icon: 'vvi_bod',
    //     fill: '#fce94f'
    //   },
    //   catId: 'science'
    // },
    {
      id: 'vskoly',
      datasetId: 'vskoly',
      visible: false,
      catId: 'science',
      style: {
        type: 'icon',
        icon: 'vvi_bod',
        fill: '#FCE94F'
      },
      // Categorized style
      // style: {
      //   type: 'categorized',
      //   attribute: 'vtype',
      //   base: {
      //     type: 'icon',
      //     icon: 'vvi_bod'
      //   },
      //   categories: [
      //     {
      //       value: 'univerzitní',
      //       label: 'Univerzitní',
      //       fill: '#F088A4'
      //     }, {
      //       value: 'neuniverzitní',
      //       label: 'Neuniverzitní',
      //       fill: '#FCE94F'
      //     }
      //   ]
      // }
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
        type: 'icon',
        icon: 'start_bod',
        anchor: [0.6, 1.05],
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
        type: 'icon',
        icon: 'start_bod',
        anchor: [0.6, 1.05],
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
      id: 'pasporty',
      datasetId: 'pasport',
      visible: false,
      style: {
        stroke: '#444',
        strokeWidth: 1.25,
        fill: ['#ef9a9a', 0.5]
      },
      catId: 'pasport'
    },
    {
      id: 'free_greenfields',
      datasetId: 'pasport',
      visible: false,
      style: {
        type: 'categorized',
        attribute: 'greenfields',
        base: {
          stroke: '#444',
          strokeWidth: 1.25
        },
        categories: [
          {
            range: [0, 150000],
            fill: ['#C8E6C9', 0.75]
          }, {
            range: [150001, 500000],
            fill: ['#81C784', 0.75]
          }, {
            range: [500001, 1000000],
            fill: ['#43A047', 0.75]
          }, {
            range: [1000001, Infinity],
            fill: ['#1B5E20', 0.75]
          }
        ]
      },
      catId: 'pasport'
    },
    {
      id: 'free_brownfields',
      datasetId: 'pasport',
      visible: false,
      style: {
        type: 'categorized',
        attribute: 'brownfields',
        base: {
          stroke: '#444',
          strokeWidth: 1.25
        },
        categories: [
          {
            range: [0, 100000],
            fill: ['#D7CCC8', 0.75]
          }, {
            range: [100001, 500000],
            fill: ['#A1887F', 0.75]
          }, {
            range: [500001, 1000000],
            fill: ['#6D4C41', 0.75]
          }, {
            range: [1000001, Infinity],
            fill: ['#3E2723', 0.75]
          }
        ]
      },
      catId: 'pasport'
    },
    {
      id: 'prepared_for_living',
      datasetId: 'pasport',
      visible: false,
      style: {
        type: 'categorized',
        attribute: 'prepared_for_living',
        base: {
          stroke: '#444',
          strokeWidth: 1.25
        },
        categories: [
          {
            value: true,
            label: 'Ano',
            fill: ['#9CCC65', 0.55]
          }, {
            value: false,
            label: 'Ne',
            fill: ['#DD4A53', 0.55]
          }
        ]
      },
      catId: 'pasport'
    },
    {
      id: 'professions_disponibility',
      datasetId: 'pasport',
      visible: false,
      style: {
        type: 'categorized',
        attribute: 'professions_disponibility',
        base: {
          stroke: '#444',
          strokeWidth: 1.25
        },
        categories: [
          {
            range: [0, 0.5],
            fill: ['#E1BEE7', 0.75]
          }, {
            range: [0.501, 1],
            fill: ['#BA68C8', 0.75]
          }, {
            range: [1.01, 1.5],
            fill: ['#8E24AA', 0.75]
          }, {
            range: [1.501, Infinity],
            fill: ['#4A148C', 0.75]
          }
        ]
      },
      catId: 'pasport'
    },
    {
      id: 'technical_workers_disponibility',
      datasetId: 'pasport',
      visible: false,
      style: {
        type: 'categorized',
        attribute: 'technical_workers_disponibility',
        base: {
          stroke: '#444',
          strokeWidth: 1.25
        },
        categories: [
          {
            range: [0, 0.5],
            fill: ['#BBDEFB', 0.75]
          }, {
            range: [0.501, 1],
            fill: ['#64B5F6', 0.75]
          }, {
            range: [1.01, 1.5],
            fill: ['#1E88E5', 0.75]
          }, {
            range: [1.501, Infinity],
            fill: ['#0D47A1', 0.75]
          }
        ]
      },
      catId: 'pasport'
    },
    {
      id: 'services_disponibility',
      datasetId: 'pasport',
      visible: false,
      style: {
        type: 'categorized',
        attribute: 'services_disponibility',
        base: {
          stroke: '#444',
          strokeWidth: 1.25
        },
        categories: [
          {
            range: [0, 0.5],
            fill: ['#FFF9C4', 0.75]
          }, {
            range: [0.501, 1],
            fill: ['#FFF176', 0.75]
          }, {
            range: [1.01, 1.5],
            fill: ['#FDD835', 0.75]
          }, {
            range: [1.501, Infinity],
            fill: ['#F9A825', 0.75]
          }
        ]
      },
      catId: 'pasport'
    },
    {
      id: 'reparers_disponibility',
      datasetId: 'pasport',
      visible: false,
      style: {
        type: 'categorized',
        attribute: 'reparers_disponibility',
        base: {
          stroke: '#444',
          strokeWidth: 1.25
        },
        categories: [
          {
            range: [0, 0.5],
            fill: ['#F5F5F5', 0.75]
          }, {
            range: [0.501, 1],
            fill: ['#E0E0E0', 0.75]
          }, {
            range: [1.01, 1.5],
            fill: ['#757575', 0.75]
          }, {
            range: [1.501, Infinity],
            fill: ['#212121', 0.75]
          }
        ]
      },
      catId: 'pasport'
    },
    {
      id: 'machine_service_disponibility',
      datasetId: 'pasport',
      visible: false,
      style: {
        type: 'categorized',
        attribute: 'machine_service_disponibility',
        base: {
          stroke: '#444',
          strokeWidth: 1.25
        },
        categories: [
          {
            range: [0, 0.5],
            fill: ['#FFE0B2', 0.75]
          }, {
            range: [0.501, 1],
            fill: ['#FFB74D', 0.75]
          }, {
            range: [1.01, 1.5],
            fill: ['#FB8C00', 0.75]
          }, {
            range: [1.501, Infinity],
            fill: ['#E65100', 0.75]
          }
        ]
      },
      catId: 'pasport'
    },
    {
      id: 'financial_business_support',
      datasetId: 'pasport',
      visible: false,
      style: {
        type: 'categorized',
        attribute: 'financial_business_support',
        base: {
          stroke: '#444',
          strokeWidth: 1.25
        },
        categories: [
          {
            value: true,
            label: 'Ano',
            fill: ['green', 0.55]
          }, {
            value: false,
            label: 'Ne',
            fill: ['red', 0.55]
          }
        ]
      },
      catId: 'pasport'
    },
    {
      id: 'business_web',
      datasetId: 'pasport',
      visible: false,
      style: {
        type: 'categorized',
        attribute: 'business_web',
        base: {
          stroke: '#444',
          strokeWidth: 1.25
        },
        categories: [
          {
            value: true,
            label: 'Ano',
            fill: ['green', 0.55]
          }, {
            value: false,
            label: 'Ne',
            fill: ['red', 0.55]
          }
        ]
      },
      catId: 'pasport'
    },
    {
      id: 'city_strategy',
      datasetId: 'pasport',
      visible: false,
      style: {
        type: 'categorized',
        attribute: 'city_strategy',
        base: {
          stroke: '#444',
          strokeWidth: 1.25
        },
        categories: [
          {
            value: true,
            label: 'Ano',
            fill: ['green', 0.55]
          }, {
            value: false,
            label: 'Ne',
            fill: ['red', 0.55]
          }
        ]
      },
      catId: 'pasport'
    },
    {
      id: 'kraje',
      datasetId: 'kraje',
      visible: false,
      identifiable: false,
      style: {
        fill: [255,255,255,0.25],
        stroke: [0, 47, 96, 0.4],
        strokeWidth: 1.75
      },
      catId: 'socioeconomic'
    },
    {
      id: 'okresy',
      datasetId: 'okresy',
      visible: false,
      identifiable: false,
      style: {
        fill: [255,255,255,0.25],
        stroke: [219,0,46, 0.4],
        strokeWidth: 1.75
      },
      catId: 'socioeconomic'
    }
  ]
};
