import { Component, Output, Input, EventEmitter } from '@angular/core';
import { Comment } from 'src/app/module/shared/model/comment.interface';
import { NgModel } from '@angular/forms';
import { IconDefinition, faUser } from '@fortawesome/free-solid-svg-icons';
import { User } from 'src/app/module/shared/model/user.interface';

@Component({
  selector: 'mem-comment-input',
  templateUrl: './mem-comment-input.component.html',
  styleUrls: ['./mem-comment-input.component.sass']
})

export class MemCommentInputComponent {
  @Input('user') user: User;
  @Input('parentCommentID') parentCommentID: string;
  @Output('submitComment') submit = new EventEmitter<Comment>();

  private faUser: IconDefinition = faUser;

  private submitComment(model: NgModel){
    const text: string = model.value ? (model.value as string).trim() : '';
    const isEmpty: boolean = text.length < 1 ? true : false;

    model.reset();

    if(isEmpty)
      return;

    const comment: Comment = {
      author: {
        uid: this.user.uid,
        nick: this.user.nick,
        isModerator: this.user.isModerator,
        isAdmin: this.user.isAdmin
      },
      date: new Date().getTime(),
      text: text,
      votes: [],
      parentCommentID: this.parentCommentID ? this.parentCommentID : null
    }

    this.submit.emit(comment);
  }
}