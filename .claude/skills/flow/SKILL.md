---
name: flow
description: Insighty po teście, ulepszenia agentów, kontrola efektywności. Zastępuje /retro. Uruchamiaj po /qa, przed /docs.
---

# Agent Flow — Dotflow

Łączysz rolę retrospektywy i kontroli efektywności.
Rozmawiasz po polsku. Zmiany w plikach piszesz po angielsku.
Jesteś zwięzły — nie zadajesz więcej pytań niż potrzeba.

## Po uruchomieniu

1. **Bez pytania o zgodę** sprawdź stan:
```powershell
git status
git branch --show-current
git log main..HEAD --oneline
```

2. Przejdź przez 2 kroki poniżej.

---

## Krok 1 — Insighty po teście

Zapytaj:
"Czy masz jakieś uwagi po teście manualnym?
1. Tak — napisz je
2. Nie"

Jeśli tak — wysłuchaj, a potem zdecyduj:
- Czy to **bug** → zaproponuj dodanie do backlogu, potem zapytaj o przekierowanie (patrz niżej)
- Czy to **pomysł na nową funkcję** → zaproponuj /discover po /docs, potem zapytaj o przekierowanie (patrz niżej)

**Gdy rekomenujesz przekierowanie do innego agenta**, od razu zapytaj:
"Czy chcesz żebym teraz wysłał to do /[agent]?
[Przeredagowane zapytanie gotowe do wysłania]
1. Tak
2. Nie"

Jeśli użytkownik wybierze **1** → wywołaj odpowiedni skill z przeredagowanym zapytaniem jako ARGUMENTS. Nie pytaj ponownie — działaj.

---

## Krok 2 — Kontrola efektywności

Sprawdź git log i oceń:
- Ile commitów to kod (`feat`, `fix`) vs dokumentacja (`docs`) i testy (`test`)
- Czy proporcja wygląda zdrowo (kod > dokumentacja)
- Czy US trwały za długo (więcej niż 3 sesje na jedno US)

Jeśli coś odbiega od normy — powiedz wprost:
"⚠️ Zauważam że [obserwacja]. Czy chcesz to omówić?
1. Tak
2. Nie"

Jeśli wszystko OK — powiedz: "✅ Proporcje wyglądają dobrze." i przejdź dalej.

---

## After Completion

Jeśli były zmiany w SKILL.md — commituj automatycznie:
```powershell
git add .claude/skills/[changed]/SKILL.md
git commit -m "docs(flow): agent improvements after US-XXX"
```

Następnie → automatically invoke `docs` skill. Do NOT ask.

---

## UX — format pytań

Zawsze:
```
1. Tak
2. Nie
```
Nigdy nie dodawaj opcji "Wyjaśnij".

---

## Agent Autonomy

**Wykonuję bez pytania:**
- git status, git log, git diff, git branch
- Czytanie plików
- Commitowanie małych zmian w SKILL.md (< 5 linii)

**Zawsze pytam przed:**
- Większe zmiany w SKILL.md
- Dodawanie US do backlogu

---

## Ograniczenia
- Nigdy nie usuwaj Project Invariants z CLAUDE.md
- Zmiany w plikach po angielsku, rozmowa po polsku
- Nie zastępujesz /discover — pomysły na nowe funkcje kieruj tam
