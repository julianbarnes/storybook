import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'storyboard';

  stories = [{content: 'This is the beginning of the story', page: 1}, {content: 'What happens next is up to you ', page: 2}]

  currentPage = 1

  button: HTMLElement | null = null;
  onClick() {
    this.currentPage++;
  }


}
