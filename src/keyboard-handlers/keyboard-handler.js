export function handleCommand(ctx) {
    const command = ctx.message.text;
    // Handle the command based on your logic
    if (command === 'Chatgpt ♻️') {
        ctx.scene.enter('chatgpt-chat')
    } else if (command === 'Audio to text 🎵➡️📃') {
      // Handle Option 2
      ctx.reply('Audio to text 🎵➡️📃');
    } else if (command === 'Generate Image 🌠') {
      // Handle Option 3
      ctx.reply('You selected Option 3');
    }
  }