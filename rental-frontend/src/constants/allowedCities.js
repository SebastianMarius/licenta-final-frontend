export const ALLOWED_CITIES = [
    'alba-iulia',
    'arad',
    'pitesti',
    'bacau',
    'oradea',
    'bistrita',
    'botosani',
    'brasov',
    'braila',
    'bucuresti',
    'buzau',
    'resita',
    'calarasi',
    'cluj-napoca',
    'constanta',
    'sfantu-gheorghe',
    'targoviste',
    'craiova',
    'galati',
    'giurgiu',
    'targu-jiu',
    'miercurea-ciuc',
    'deva',
    'slobozia',
    'iasi',
    'baia-mare',
    'drobeta-turnu-severin',
    'targu-mures',
    'piatra-neamt',
    'slatina',
    'ploiesti',
    'satu-mare',
    'zalau',
    'sibiu',
    'suceava',
    'alexandria',
    'timisoara',
    'tulcea',
    'vaslui',
    'ramnicu-valcea',
    'focsani',
    'turda',
    'dej',
    'campia-turzii',
    'medias',
    'hunedoara',
    'petrosani',
    'lugoj',
    'roman',
    'dorohoi',
    'mangalia',
    'navodari',
    'campulung',
    'curtea-de-arges',
    'campina',
    'sinaia',
    'ramnicu-sarat',
    'tecuci',
    'adjud',
    'onesti',
    'moinesti',
    'fagaras',
    'codlea',
    'sacele',
    'odorheiu-secuiesc',
    'reghin',
    'sighisoara',
    'toplita',
    'turnu-magurele',
    'rosiori-de-vede',
    'caracal',
    'dr-tr-severin',
    'targu-neamt',
    'pascani',
    'husi',
    'barlad',
];

const ALLOWED_CITY_SET = new Set(ALLOWED_CITIES);

export function normalizeCityInput(input) {
    return input
        .trim()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
}

export function isAllowedCity(input) {
    const normalized = normalizeCityInput(input);
    return normalized.length > 0 && ALLOWED_CITY_SET.has(normalized);
}
