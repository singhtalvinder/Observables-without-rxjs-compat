import { Component, OnInit, OnDestroy } from '@angular/core';

import { Observable, Observer, Subscription, interval } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  numbersObsSubscription: Subscription;
  customObsSubscription: Subscription;

  constructor() { }

  ngOnInit() {

    //build our own simple observable without rxjs-compat, which
    // doesn't uses Observable for interval. And uses pipe for operators.
    // example usage of operators...
    const myNumbers = interval(1000)
    .pipe(map( (data: number)=> {
      return data * 2;
    }));
  

    this.numbersObsSubscription = myNumbers.subscribe(
      (numbr: number) =>{
        console.log(numbr);
      });

    // -The above one will keep on running forever even when we go to some other
    // navigation(like user1 or 2). This will lead to leak. So, to avoid this we need to 
    // implement OnDestroy to handle it.


    // create an observable that will fire after 2-secs and after
    // 4-secs and which will also fail after 5-secs.
    // and see how it completes...

    const myObservable = Observable.create((observer: Observer<string>) => {
      setTimeout(()=> {
        observer.next('first package');
      }, 2000);
      setTimeout(()=> {
        observer.next('second package');
      }, 4000);
      setTimeout(()=> {
        //observer.error('this will not work');
        observer.complete();
      }, 5000);

      setTimeout(()=> {
        observer.next('Third package!!');
      }, 6000);
    });

    //subscribe to this observable, with all three arguments.
    this.customObsSubscription = myObservable.subscribe(
      (data: string) => {
          console.log(data);
      },
      (error: string) => {
        console.log(error);
      },
      () => {
          console.log('Completed !!');
      });
  }

  ngOnDestroy() {
    this.numbersObsSubscription.unsubscribe();
    this.customObsSubscription.unsubscribe();
  }

}
