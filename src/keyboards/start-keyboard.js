export function startKeyboard(ctx) {
    ctx.reply('Please select an option:', {
        reply_markup: {
          keyboard: [
            ['Chatgpt ♻️', 'Audio to text 🎵➡️📃'],
            ['Generate Image 🌠']
          ],
          resize_keyboard: true,
          one_time_keyboard: true
        }
      });
  }