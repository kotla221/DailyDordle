# 🟩 Daily Dordle

A daily word puzzle game where you guess **two 5-letter words simultaneously** — with only **7 shared guesses**.

🔗 **[Play Now → dailydordle.vercel.app](https://dailydordle.vercel.app)**

---

## How to Play

- Two side-by-side boards, each hiding a secret 5-letter word
- Type a 5-letter word and press **ENTER** — your guess applies to **both** boards at once
- You have **7 guesses** to solve both words
- A new puzzle drops every day at midnight

### Tile Colors

| Color | Meaning |
|-------|---------|
| 🟩 Green | Right letter, right spot |
| 🟨 Yellow | Right letter, wrong spot |
| ⬛ Gray | Letter not in the word |

---

## Built With

- [Expo](https://expo.dev) (SDK 54)
- [React Native](https://reactnative.dev) (0.81)
- [React Native Web](https://necolas.github.io/react-native-web/)
- [Vercel](https://vercel.com) — hosting

---

## Run Locally

```bash
git clone https://github.com/kotla221/DailyDordle.git
cd DailyDordle
npm install
npx expo start
```

Open on your phone with [Expo Go](https://expo.dev/go) by scanning the QR code.

## Deploy

```bash
npx expo export -p web
cd dist
vercel --prod
```
