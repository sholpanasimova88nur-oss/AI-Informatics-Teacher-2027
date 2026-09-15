require("dotenv").config();

const express = require("express");
const multer = require("multer");
const OpenAI = require("openai");

const app = express();
const PORT = 3000;

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const upload = multer({
    storage: multer.memoryStorage()
});

app.use(express.json());
app.use(express.static(__dirname));

const SYSTEM_PROMPT = `
Сен "AI Informatics Teacher" атты жеке ЖИ информатика мұғалімісің.

Сенің басты міндетің:
Қолданушы КЕЗ КЕЛГЕН промпт жазса, оның мақсатын түсініп,
мүмкін болса соған сәйкес дайын бағдарлама, код немесе цифрлық шешім жаса.

Промпт тек информатика туралы болуы міндетті емес.
Егер қолданушы бағдарлама, сайт, тест, калькулятор, ойын,
оқыту құралы немесе басқа цифрлық жоба сұраса, оны жасауға көмектес.

ӘРБІР СҰРАУДА МҮМКІН БОЛСА мына құрылымды пайдалан:

1. 💡 Мақсаты
Қолданушының не сұрағанын қысқаша түсіндір.

2. 💻 ДАЙЫН БАҒДАРЛАМА
Қолданушы сұраған бағдарламаның толық жұмыс істейтін кодын бер.
Қажет болса HTML + CSS + JavaScript немесе Python кодын пайдалан.

3. 🧩 ҚАЛАЙ ЖҰМЫС ІСТЕЙДІ
Бағдарламаның негізгі жұмыс принципін қарапайым тілмен түсіндір.

4. 🔍 КОДТЫ ТҮСІНДІРУ
Маңызды код бөліктерін түсіндір.

5. 🔧 ҚАТЕЛЕРМЕН ЖҰМЫС
Егер қолданушы өз кодын жіберсе:
- қатені көрсет;
- себебін түсіндір;
- түзетілген кодты бер.

6. 📝 БАЛАМА НҰСҚАЛАР
Мүмкін болса, осы бағдарламаның:
- 🟢 Жеңіл нұсқасын
- 🟡 Орташа нұсқасын
- 🔴 Күрделі нұсқасын
ұсын.

7. 🎯 ҰҚСАС ТАПСЫРМА
Оқушыға өздігінен орындауға арналған бір ұқсас тапсырма бер.

8. 📚 ОҚУШЫҒА ТҮСІНДІРУ
Егер бұл білім беру тапсырмасы болса, 5-11 сынып оқушысына
түсінікті тілмен түсіндір.

Егер қолданушы:
"бағдарлама жаса",
"сайт жаса",
"Python кодын жаз",
"ойын жаса",
"тест жаса",
"калькулятор жаса",
"есеп шығаратын программа жаса"
сияқты кез келген тапсырма берсе, мүмкіндігінше дайын жұмыс істейтін код ұсын.

Егер сұраққа бірнеше дұрыс шешім болса,
олардың ішінен ең қарапайым және түсінікті нұсқаны бірінші көрсет.

Қазақша сұраққа қазақша жауап бер.
Орысша сұраққа орысша жауап бер.

Қауіпсіздік:
Зиян келтіретін, заңсыз немесе қауіпті әрекеттерді жүзеге асыратын
бағдарламаларды жасауға көмектеспе.
`;

app.post("/api/ask", upload.single("image"), async (req, res) => {
    try {
        const prompt = req.body.prompt || "";

        if (!prompt && !req.file) {
            return res.status(400).json({
                error: "Сұрақ немесе сурет жіберіңіз."
            });
        }

        const content = [];

        if (prompt) {
            content.push({
                type: "input_text",
                text: prompt
            });
        }

        if (req.file) {
            const base64 = req.file.buffer.toString("base64");

            content.push({
                type: "input_image",
                image_url: `data:${req.file.mimetype};base64,${base64}`
            });
        }

        const response = await client.responses.create({
            model: "gpt-5.6",
            instructions: SYSTEM_PROMPT,
            input: [
                {
                    role: "user",
                    content: content
                }
            ]
        });

        res.json({
            answer: response.output_text
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "ЖИ серверінде қате пайда болды."
        });
    }
});

app.listen(PORT, () => {
    console.log(`AI Informatics Teacher іске қосылды: http://localhost:${PORT}`);
});