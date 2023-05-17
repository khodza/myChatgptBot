export function globalCallbackQueryHandler(ctx) {
    const callbackData = ctx.callbackQuery.data;
    switch (callbackData) {
      case 'end-of-chat':
        // Delete the inline keyboard
        ctx.deleteMessage();
        ctx.reply('chat has been ended');
        ctx.scene.leave();
        break;
      case 'btn2':
        ctx.reply('You clicked Button 2');
        break;
      case 'btn3':
        ctx.reply('You clicked Button 3');
        break;
      default:
        ctx.reply('Unknown button clicked');
    }
  }