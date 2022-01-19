import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let app: AppComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        AppComponent
      ],
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(AppComponent);
      app = fixture.componentInstance
    });
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it(`should have as title 'storyboard'`, () => {
    expect(app.title).toEqual('storyboard');
  });


  it('should go to the next page when the right button is clicked', fakeAsync(() => {
    fixture.detectChanges()
    const compiled = fixture.debugElement.nativeElement as HTMLElement;
    const button = compiled.querySelectorAll('button')[1]

    button?.click();
    tick();
    fixture.detectChanges()
    let content = (fixture.debugElement.nativeElement as HTMLElement).textContent
    console.log(content)
    expect(content?.indexOf('Page 2')).toBeGreaterThan(0)
    
  }))

  it('should go to the previous page when the left button is clicked', fakeAsync(() => {
    const compiled = fixture.debugElement.nativeElement as HTMLElement;
    // click next button 
    let nextButton = compiled.querySelectorAll('button')[1]
    nextButton?.click();
    tick();
    fixture.detectChanges()
    // click previous button 
    let prevButton = compiled.querySelectorAll('button')[0]
    prevButton?.click();
    tick();
    fixture.detectChanges()
    let content = (fixture.debugElement.nativeElement as HTMLElement).textContent
    console.log(content)
    expect(content?.indexOf('Page 1')).toBeGreaterThan(0)
    
  }))

  it('should not change the page number if its on page 1 and the previous page button is clicked', fakeAsync(() => {
    const compiled = fixture.debugElement.nativeElement as HTMLElement;
    // click previous button 
    let prevButton = compiled.querySelectorAll('button')[0]
    prevButton?.click();
    tick();
    fixture.detectChanges()
    // click next button 
    let nextButton = compiled.querySelectorAll('button')[1]
    nextButton?.click();
    tick();
    fixture.detectChanges()
    let content = (fixture.debugElement.nativeElement as HTMLElement).textContent
    console.log(content)
    expect(content?.indexOf('Page 2')).toBeGreaterThan(0)
  }))

  it('should not change the page number if its on the last page and the next page button is clicked', fakeAsync(() => {
    const compiled = fixture.debugElement.nativeElement as HTMLElement;
    
    // click next button twice
    let nextButton = compiled.querySelectorAll('button')[1]
    nextButton?.click();
    tick();
    fixture.detectChanges()
    nextButton?.click();
    tick();
    fixture.detectChanges()

    // click previous button 
    let prevButton = compiled.querySelectorAll('button')[0]
    prevButton?.click();
    tick();
    fixture.detectChanges()

    let content = (fixture.debugElement.nativeElement as HTMLElement).textContent
    console.log(content)
    expect(content?.indexOf('Page 1')).toBeGreaterThan(0)
  }))
});
