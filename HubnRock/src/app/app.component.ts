import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'HubnRock';

  onActivate(event) {
    let scrollToTop = window.setInterval(() => {
        let pos = window.pageYOffset;
        if (pos > 0) {
            window.scrollTo(0, pos - 20); // how far to scroll on each step
        } else {
            window.clearInterval(scrollToTop);
        }
    }, 5);  //de moment hi posem 5 ms
  }

  // onActivate(e) {
  //   if (e.constructor.name)==="login"{ // for example
  //           window.scroll(0,0);
  //   }
  // }
}
