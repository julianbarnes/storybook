import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'storyboard';

  stories = [{content: 'This is the beginning of the story', page: 1},
             {content: 'What happens next is up to you ', page: 2},
            {content: 'Sometimes you have options', page: 3},
          {content: 'Sometimes you don\'t'}]

  currentPage = 1

  button: HTMLElement | null = null;
  onNext() {
    if(this.currentPage < this.stories.length) {
      this.currentPage++;
    }
  }

  onPrev() {
    if(this.currentPage > 1) {
      this.currentPage--;
    }
  }


}
