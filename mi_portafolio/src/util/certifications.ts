export type Certification = {
    title: string
    issuer: string
    issueDate: string
    credentialId?: string
    credentialUrl: string
    description: string
    topics: string[]
}

export const certifications: Certification[] = [
    {
        title: "Associate Cloud Engineer",
        issuer: "Google Cloud",
        issueDate: "Sep 2024",
        credentialId: "13366036-ed06-4f79-b557-02da4acd65c2",
        credentialUrl: "https://www.credly.com/badges/13366036-ed06-4f79-b557-02da4acd65c2",
        description:
            "El proceso para obtener formalmente el título de Associate Cloud Engineer culminará con la aplicación práctica y la certificación oficial tras dominar los fundamentos teóricos que ya has revisado, los cuales incluyen el despliegue de soluciones, el monitoreo operativo, la gestión de IAM y la administración de redes y almacenamiento; la clave es transformar esa teoría en habilidad práctica a través del uso intensivo de la interfaz de línea de comandos (CLI) / gcloud SDK y la Cloud Console. Este camino de estudio y experiencia práctica finalizará con la inscripción y la aprobación satisfactoria del examen de certificación oficial de Google Cloud, validando tu capacidad para realizar tareas operativas esenciales y consolidando tu título como Associate Cloud Engineer.",
        topics: ["Cloud Architecture", "Cloud Computing", "DevOps", "Iam", "GKE", "Networking", "Google Cloud Platform"],
    },
    {
        title: "Python Essentials 1",
        issuer: "Cisco Networking Academy",
        issueDate: "Aug 2025",
        credentialId: "FDE-8217",
        credentialUrl: "https://www.credly.com/earner/earned/badge/36d51470-cc8b-444f-b69a-7e2592336872",
        description:
            "Cisco, en colaboración con OpenEDG Python Institute, verifica que la persona que obtiene este distintivo ha completado con éxito el curso Python Essentials 1 y ha alcanzado las credenciales a nivel estudiantil. Los titulares tienen conocimientos sobre los conceptos de programación informática, la sintaxis y semántica del lenguaje Python, así como la capacidad de realizar tareas de codificación relacionadas con los fundamentos de la programación en Python y resolver desafíos de implementación utilizando la Biblioteca Estándar de Python.",
        topics: ["Python"],
    },
    {
        title: "Python Essentials 2",
        issuer: "Cisco Networking Academy",
        issueDate: "Nov 2025",
        credentialId: "9ec9fcc3-e553-43cf-8c55-0b631d376ad0",
        credentialUrl: "https://www.credly.com/earner/earned/badge/9ec9fcc3-e553-43cf-8c55-0b631d376ad0",
        description:
            "Cisco, en colaboración con OpenEDG Python Institute, verifica que el titular de esta insignia completó con éxito el curso Python Essentials 2 y logró las credenciales a nivel estudiantil. Los titulares poseen conocimientos y habilidades en aspectos intermedios de la programación en Python, incluyendo módulos, paquetes, excepciones, procesamiento de archivos, así como técnicas generales de codificación y programación orientada a objetos (POO), y prepara al estudiante para la certificación PCAP – Certified Associate in Python Programming.",
        topics: ["Python"],
    },
]
