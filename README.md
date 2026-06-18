#E-commerce Gaming Catalog

Aplikacja będąca odpowiedzią na zadanie rekrutacyjne. Projekt polegał na stworzeniu nowoczesnego, responsywnego katalogu produktów, który integruje się z zewnętrznym API w celu pobierania i prezentowania danych.


Główne Funkcje Aplikacji (Zgodnie z wymaganiami zadania)
1. Asynchroniczne pobieranie danych i obsługa stanów sieciowych:
   - Komunikacja z API za pomocą `async/await` i natywnego `fetch()`.
   - Pełna obsługa stanów UX: dynamiczny, animowany indykator ładowania (Loader) oraz odporna na błędy sekcja komunikatów (Error State) wyświetlająca szczegółowe powody awarii sieci w czytelnym dla użytkownika boksie.
   - Aktywny systemowy wskaźnik „ONLINE” w nagłówku, symulujący integrację z dashboardem systemowym.

2. Zaawansowana, dynamiczna prezentacja danych:
   - Wyświetlanie produktów w formie nowoczesnej, elastycznej siatki (**CSS Grid**).
   - Dynamiczne generowanie kart produktowych z uwzględnieniem unikalnych identyfikatorów (`#id`), kategorii, opisów, tagów oraz stanów magazynowych (`stock` -> wizualny status „Dostępny” / „Wyprzedane”).

3. Kombinowane filtrowanie w czasie rzeczywistym:
   - **Filtrowanie po kategoriach:** Lista kategorii w elemencie `<select>` nie jest wpisana na sztywno. Skrypt automatycznie analizuje dane z API, wyciąga unikalne nazwy za pomocą obiektu `Set` i dynamicznie buduje opcje wyboru.
   - **Filtrowanie po cenie:** Płynny suwak (Range Slider) odzwierciedlający budżet maksymalny użytkownika, aktualizujący wartość w interfejsie w locie (zdarzenie `input`).
   - **Współbieżność filtrów:** Filtry działają komplementarnie – zmiana ceny uwzględnia wybraną kategorię i na odwrót, zapobiegając nadpisywaniu kryteriów wyszukiwania.

4. Matematyczna paginacja klientów:
   - Podział bazy danych na sztywne porcje (6 produktów na stronę) przy użyciu metody `.slice()`.
   - Dynamicznie renderowane cyfry stron oraz inteligentne przyciski „Poprzednia” i „Następna”, automatycznie blokowane (`disabled`) na skrajnych pozycjach.
   - Pasek nawigacji jest ukrywany, jeśli przefiltrowane wyniki mieszczą się na jednej stronie (zapobieganie śmieceniu UI).

5. Interaktywne Okno Modalne:
   - Wykorzystanie optymalnej wydajnościowo techniki **delegacji zdarzeń (Event Delegation)** na całym kontenerze siatki.
   - Dynamiczne wstrzykiwanie pełnego, surowego obiektu danych JSON z API po kliknięciu w kartę produktu lub przycisk szczegółów.
   - Przełamywanie scrollowania tła (`overflow: hidden`) oraz wszechstronne zamykanie: poprzez przycisk „X”, kliknięcie w szary overlay (tło) lub naciśnięcie klawisza Escape.

6. Pełna persystencja stanu w adresie URL:
   - Każda zmiana filtrów lub przejście na kolejną stronę modyfikuje parametry zapytania (`Query Parameters`) w pasku adresu przy użyciu `URLSearchParams` i `window.history.pushState()`.
   - Projekt w pełni obsługuje odświeżanie strony (`F5`) oraz bezpośrednie udostępnianie/kopiowanie linków – aplikacja automatycznie odczytuje stan z URL przy starcie i inicjuje widok na właściwej podstronie z zachowaniem filtrów.


Wersja demonstracyjna
Projekt został wdrożony i jest dostępny publicznie pod adresem:  
https://rgrcode.github.io/cosibella-gaming/


Wykorzystane Technologie

* HTML5: Semantyczny podział dokumentu (`<header>`, `<main>`, `<section>`, `<article>`).
* SASS (SCSS):** Modułowa architektura stylów oparta na zmiennych tokenów kolorystycznych, resetowaniu stylów oraz dedykowanych komponentach.
* Vanilla JS (ES6+): Logika aplikacji oparta jest na jednym, centralnym obiekcie `state`. Dzięki temu wszystkie zmiany filtrów czy stron płyną z jednego źródła prawdy, co sprawia, że cały interfejs (siatka produktów, paginacja, URL) zawsze wyświetla aktualne i spójne dane.
* Responsive Web Design (RWD): Pełna adaptacja interfejsu od desktopów 4K, przez tablety, aż po małe ekrany smartfonów (gdzie np. paginacja inteligentnie chowa napisy, pozostawiając same symbole sterujące).


Instrukcja instalacji projektu:

1. Pobranie kodu na dysk lokalny:
git clone https://github.com/RGRcode/cosibella-gaming
cd cosibella-gaming

2. Uruchomienie
Otwórz folder w VS Code i kliknij "Go Live" (używając wtyczki Live server)
