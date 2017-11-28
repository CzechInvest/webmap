 
export default function formatValue(value, params = {}) {
  if (Array.isArray(value)) {
    value = value.join(', ');
  }
  if (params.type === 'number') {
    value = Intl.NumberFormat.apply(null, params.format || []).format(value)
  }
  if (params.template) {
    value = params.template.replace(/\$\{value\}/g, value.toString());
  }
  return value;
}
