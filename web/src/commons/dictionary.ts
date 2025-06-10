import { Status } from "@/enums/status.enum";
import { Profile } from "@/enums/profile.enum";
import { BmiClassification } from "@/enums/bmi-classification";

export type WordsToTranslate = `${Status}` | `${Profile}` | `${BmiClassification}`;

export const dictionary = (word: WordsToTranslate): string => {
    const dictionary: Record<WordsToTranslate, string> = {
        admin: "Administrador",
        student: "Estudante",
        teacher: "Professor",
        active: "Ativo",
        inactive: "Inativo",
        overweight: "Sobrepeso",
        normal: "Normal",
        underweight: "Abaixo do peso",
        obesity_class_1: "Obesidade grau 1",
        obesity_class_2: "Obesidade grau 2",
        obesity_class_3: "Obesidade grau 3",
    };

    return dictionary[word] || word;
};
