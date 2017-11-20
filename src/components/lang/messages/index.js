import cs from './cs';
import en from './en';

// Note messages for all languages are imported all at once. That's fine for
// almost all apps. If gzipped messages dir is bigger then say 20 kB, congrats!
// Your app is used and useful, so now it's time for further optimization. Since
// messages are in app state, they can be fetched or passed from server easily.

export default { cs, en };
