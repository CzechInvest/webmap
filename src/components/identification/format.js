 
export default function formatValue(value, params = {}) {
  if (Array.isArray(value)) {
    value = value.filter(v => v).join(', ');
  }
  if (params.type === 'map') {
    value = params.map[value] || '-';
  } else if (params.type === 'number') {
    value = Intl.NumberFormat.apply(Intl, params.format || []).format(value);
  } else if (params.type === 'boolean') {
    value = value ? 'Ano' : 'Ne';
  } else if (params.type === 'object') {
    var keys = params["value"].split(".");
    for (var i = 1; i < keys.length; i++) {
      value = value[keys[i]]
    }
  }
  if (value === undefined || value === null) {
    value = '';
  }
  if (params.template) {
    value = params.template.replace(/\$\{value\}/g, value.toString());
  }
  return value;
}
