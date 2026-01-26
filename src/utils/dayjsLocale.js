// src/utils/dayjsLocale.js
import dayjs from 'dayjs';
import 'dayjs/locale/es'; // Importa el locale en español
import localizedFormat from 'dayjs/plugin/localizedFormat';

dayjs.extend(localizedFormat);
dayjs.locale('es'); // Establece el locale global en español