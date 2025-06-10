export type WordsToTranslate = "admin" | "student" | "teacher" | "active" | "inactive";

export const dictionary = (word: WordsToTranslate): string => {
    const dictionary: Record<WordsToTranslate, string> = {
        admin: "Administrador",
        student: "Estudante",
        teacher: "Professor",
        active: "Ativo",
        inactive: "Inativo",
    };

    return dictionary[word] || word;
};
