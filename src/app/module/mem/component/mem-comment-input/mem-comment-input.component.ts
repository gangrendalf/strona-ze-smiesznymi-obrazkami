import { Component, Output, Input, EventEmitter } from '@angular/core';
import { Comment } from 'src/app/module/shared/model/comment.interface';
import { NgForm } from '@angular/forms';
import { IconDefinition, faUser } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'mem-comment-input',
  templateUrl: './mem-comment-input.component.html',
  styleUrls: ['./mem-comment-input.component.sass']
})

export class MemCommentInputComponent {
  @Input('userID') userID: string;
  @Input('userNick') userNick: string;
  @Input('parentCommentID') parentCommentID: string;
  
  @Output('submitComment') submit = new EventEmitter<Comment>();

  private _iconUser: IconDefinition = faUser;

  private submitComment(f: NgForm){
    let comment: Comment = {
      author: {
        uid: this.userID,
        nick: this.userNick
      },
      date: new Date().getTime(),
      text: f.value.text,
      votes: [],
      parentID: this.parentCommentID ? this.parentCommentID : null
    }

    this.submit.emit(comment);
  }
}