import { Component, Output, Input, EventEmitter } from '@angular/core';
import { Comment } from 'src/app/module/shared/model/comment.interface';
import { NgForm } from '@angular/forms';
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

  private _iconUser: IconDefinition = faUser;

  private submitComment(f: NgForm){
    let comment: Comment = {
      author: {
        uid: this.user.uid,
        nick: this.user.nick
      },
      date: new Date().getTime(),
      text: f.value.text,
      votes: [],
      parentCommentID: this.parentCommentID ? this.parentCommentID : null
    }

    this.submit.emit(comment);
  }
}