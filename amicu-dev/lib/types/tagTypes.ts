
export interface TagData {
    name: string
    complexity: number
}

export interface TagPostProps {
    newTags : TagData[]
    deletedTags : TagData[]
}

export interface SkillLevel {
    name : string
    color : string
}

export const skillLevels : SkillLevel[] = [
    {name : "beginner", color : "none"},
    {name : "novice", color : "ring-yellow-700"},
    {name : "Intermediate", color : "ring-zinc-300"},
    {name : "Advanced", color : "ring-yellow-300"},
    {name : "Expert", color : "ring-cyan-400"},
]