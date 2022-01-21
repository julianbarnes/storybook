import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'storyboard';

  stories = [{content: 'The Unveiling of Jesus: Revelation'},
             {content: 'The Lamb Is the Alpha and the Omega: Assurance'},
            {content: 'The Lamb is the Lion: Redemption'},
          {content: 'The Lamb is the Shepherd: Provision'},
          {content: 'The Lamb is the Victor: Celebration'},
          {content: 'The Lamb is the Bridegroom: Faithfulness'},
          {content: 'The Lamb is the Beginning and the End: Restoration'}]
          //I don't think we're studying what we have well enough 

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
