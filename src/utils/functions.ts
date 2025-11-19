import { join } from "path";
import { ResponseStatus, Subject } from "./types";
import fs from "fs";

export const getFilePath = () => {
    return join(__dirname, "..", "..", "src", "bot", "subjectsInfo.txt");
};

export const updateSubjectsFile = (subjects: Subject[]) => {
    fs.writeFileSync(getFilePath(), JSON.stringify(subjects, null, 2), 'utf8');
};

export const handleResponse = (response: ResponseStatus): string => {

    const defaultMsg = 'Ha ocurrido un error desconocido, por favor intente nuevamente o consulte a ldevecchi@frba.utn.edu.ar.';
    switch (response) {
        case ResponseStatus.SUCCESS:
            return 'Operación exitosa.';
        case ResponseStatus.INVALID_CREDENTIALS:
            return 'Usuario o contraseña incorrectos.';
        case ResponseStatus.ERR_ACCESS_ACADEMIC_RECORD:
            return 'Error al acceder al historial académico. Reintente nuevamente.';
        case ResponseStatus.ERR_GET_SUBJECTS:
            return 'Error al obtener las materias. Reintente nuevamente.';
        default:
            return defaultMsg;
    }
};