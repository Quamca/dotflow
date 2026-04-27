# Dotflow — Test Corpus for Manual AI Verification

**Version:** 1.0
**Date:** 2026-04-27
**Purpose:** Predefined Polish-language journal entries with known AI-expected outputs. Use during manual verification instead of typing random text — this ensures AI features produce verifiable, meaningful results.

**How to use:** When a manual test step says "type entry A1," copy the entry text from this file into the New Entry form. Do not modify the wording — even small changes can affect AI similarity scores and theme extraction.

---

## SCENARIO A — Connection Detection (entries that SHOULD connect)

These three entries share the same emotional pattern: **feeling unheard / invisible in a conversation**. At least 2 of the 3 pairs should trigger a connection badge (score ≥ 0.7).

### A1

> Znowu miałem trudną rozmowę z szefem. Czułem się niesłyszany — tłumaczyłem swój pomysł przez kwadrans, a on po prostu zmienił temat. Wróciłem do biurka i przez godzinę nie mogłem się skupić. Nie wiem, czy to problem z nim, czy ze mną.

### A2

> Dzisiaj na spotkaniu projektowym próbowałem zabrać głos, ale kolega wszedł mi w słowo i rozmowa potoczyła się bez mnie. Czułem się niewidzialny. To chyba już drugi raz w tym tygodniu, kiedy miałem wrażenie, że moje zdanie nie ma znaczenia.

### A3

> Mama znowu mnie zignorowała kiedy mówiłem o swojej pracy. Zaczęła odpowiadać na telefon w środku mojego zdania. Czuję się z tym bardzo dziwnie — jakbym mówił do ściany. Zastanawiam się, czy mam problem z komunikowaniem się z ludźmi.

**Expected AI output:**
- A1↔A2 similarity score ~0.85
- A1↔A3 similarity score ~0.75
- A2↔A3 similarity score ~0.72

**Pass criteria:** At least 2 of 3 pairs receive a connection badge. GPT-4o-mini has temperature variance — requiring all 3 would produce false failures.

---

## SCENARIO B — No Connection (entries that should NOT connect)

These two entries cover entirely different topics with no shared emotional pattern. No connection badge should appear.

### B1

> Dziś zrobiłem świetny trening. Pobiegłem 8 km w nowym rekordzie, czułem się naprawdę silny. Pogoda była idealna, słońce ale nie za gorąco. Zamówię sobie nowe buty do biegania.

### B2

> Skończyłem czytać tę książkę o historii Japonii. Była fascynująca, szczególnie rozdział o epoce Meiji. Chyba zacznę się uczyć japońskiego — od dawna o tym myślę.

**Expected AI output:** Similarity score < 0.4, no connection badge between B1 and B2.

**Pass criteria:** No connection badge appears after saving B2 (with B1 already in the journal).

---

## SCENARIO C — Values Extraction (5 entries for extractUserValues())

These five entries each surface a distinct recurring theme. Together they should yield 5 extracted values from `extractUserValues()`.

### C1 — theme: relationships / relacje z bliskimi

> Spędziłem dziś wieczór na rozmowie z Anią. Rzadko mamy teraz czas żeby po prostu porozmawiać — ona ma swoją pracę, ja swoje projekty. Cieszę się z każdej takiej chwili. Relacje są dla mnie ważniejsze niż myślałem.

### C2 — theme: personal growth / rozwój osobisty

> Dostałem feedback od klienta że projekt wyszedł świetnie. Ale bardziej niż pochwała cieszy mnie to, że sam widzę jak bardzo się rozwinąłem przez ostatnie pół roku. Chcę się uczyć dalej — to nie jest dla mnie opcjonalne.

### C3 — theme: helping others / pomaganie innym

> Pomogłem dziś Markowi naprawić jego komputer. Nie zajęło to dużo czasu, ale on był bardzo wdzięczny. Lubię kiedy mogę być pomocny — czuję wtedy że robię coś konkretnego dla kogoś.

### C4 — theme: health and energy / zdrowie i energia

> Nie spałem dziś dobrze bo za długo siedziałem nad tym projektem. Wiem, że powinienem bardziej pilnować swojego rytmu. Zdrowie i energia to podstawa — bez tego nic nie zrobię.

### C5 — theme: family / rodzina

> Zadzwoniłem dziś do rodziców, bo dawno nie rozmawialiśmy. Tato opowiadał o ogrodzie, mama o sąsiadach. Proste rzeczy, ale po rozmowie czułem się spokojniejszy. Rodzina jest dla mnie kotwicą.

**Expected AI output:**
`extractUserValues()` returns 5 themes semantically close to:
`["relacje z bliskimi", "rozwój osobisty", "pomaganie innym", "zdrowie i energia", "rodzina"]`

**Pass criteria:** AI returns 5 items, each semantically covering one of the above themes. Exact wording does not need to match — check meaning, not phrasing.

---

## SCENARIO D — Pattern Summary (use C1–C5 above + D1–D5 below = 10 entries total)

Write C1–C5 first, then D1–D5. After the 10th entry, click "Generate insights."

### D1 — theme: avoidance / odkładanie trudnych zadań

> Znowu odłożyłem ten trudny telefon do klienta. Wiem że muszę zadzwonić, ale wciąż szukam dobrego momentu. Chyba boję się konfrontacji — wolę żeby sprawy same się rozwiązały, ale wiem że tak nie będzie.

### D2 — theme: fear bigger than the task / lęk większy niż zadanie

> Skończyłem wreszcie ten raport którego się bałem. Zajął mi trzy godziny i wcale nie był taki straszny jak myślałem. Znowu przekonałem się, że mój lęk przed zadaniem jest gorszy niż samo zadanie.

### D3 — theme: self-discipline struggles / regularność

> Dziś byłem zły na siebie że nie poszedłem na siłownię trzeci dzień z rzędu. Zawsze mam jakiś powód żeby nie iść. Chyba muszę to zreorganizować — może rano zamiast wieczorem.

### D4 — theme: meaningful connection / spotkanie z podobnymi

> Miałem dziś świetną rozmowę z nowym znajomym z konferencji. Łatwo mi się z nim rozmawiało — mamy podobne podejście do pracy i podobne frustracje. Cieszę się kiedy poznaję ludzi którzy myślą podobnie.

### D5 — theme: rest and recovery / odpoczynek

> Zrobiłem sobie dziś wolny wieczór bez ekranów. Czytałem, zrobiłem herbatę, wyszedłem na krótki spacer. Rzadko to robię a zawsze potem czuję się lepiej. Powinienem częściej.

**Expected AI output:**
`generatePatternSummary()` returns 3–5 bullet observations semantically covering:
- Pattern of avoiding difficult tasks / procrastination
- Relationships and meaningful conversations as energy sources
- Tension between self-discipline intentions and actual behavior
- Growth and professional development as recurring motivation

**Pass criteria:** AI returns 3–5 observations, at least 2 of the above themes are recognizably present. Exact wording is not required — evaluate semantically.

---

## Notes for Developers

- **Temperature variance:** GPT-4o-mini at temperature 0.7 has natural output variance. Failing one sub-check does not mean the feature is broken — evaluate the overall pattern.
- **Do not change entry text** before testing. Even minor rewording affects embedding similarity scores used in connection detection.
- **Ordering matters for Scenario D:** Write C1–C5 before D1–D5 so the pattern summary has the full value-rich context from Scenario C.
- **Scenario A test order:** Write A1 first, then A2. After saving A2, check for a connection badge pointing to A1. Then write A3 and check for connection badges.

---

*Owned by development team. Update when AI prompts or detection thresholds change.*
