import { BindPage } from './app.po';

describe('bind App', () => {
  let page: BindPage;

  beforeEach(() => {
    page = new BindPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
