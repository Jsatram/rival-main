type PlayerProfilePayload = {
signals: SignalSummary[]
archetypeScores: {
primary: Archetype
secondary?: Archetype
scores: Record<Archetype, number>
}
roleFit: {
declaredRole: Role
expressedRole: Role
fitScore: number
}
unorthodox: {
deviationScore: number
efficiencyScore: number
tag: 'standard' | 'creative' | 'high-risk'
}
confidence: {
level: 'low' | 'medium' | 'high'
reason: string
}
matchesAnalyzed: number
window: string
lastComputedAt: string
}
