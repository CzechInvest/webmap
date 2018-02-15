 
export default function formatValue(value, params = {}) {
  if (Array.isArray(value)) {
    value = value.join(', ');
  }
  if (params.type === 'map') {
    value = params.map[value] || '-';
  } else if (params.type === 'number') {
    value = Intl.NumberFormat.apply(Intl, params.format || []).format(value);
  }
  if (params.template) {
    value = params.template.replace(/\$\{value\}/g, value === undefined ? '' : value.toString());
  }
  return value;
}
