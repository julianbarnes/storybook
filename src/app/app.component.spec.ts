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
    const button = compiled.querySelector('button')

    button?.click();
    tick();
    fixture.detectChanges()
    let content = (fixture.debugElement.nativeElement as HTMLElement).textContent
    console.log(content)
    expect(content?.indexOf('Page 2')).toBeGreaterThan(0)
    // fixture.whenStable().then(() => {
    //   expect((fixture.debugElement.nativeElement as HTMLElement).textContent?.indexOf('Page 2')).toBeGreaterThan(0)
    // })
    //click 
  }))

  it('should go to the previous page when the left button is clicked')
});
