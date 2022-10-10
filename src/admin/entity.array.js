"use strict";
exports.__esModule = true;
var user_entity_1 = require("../../../../../../../../src/services/user/entities/user.entity");
var userQuiz_entity_1 = require("../../../../../../../../src/services/user/entities/userQuiz.entity");
var wrongList_entity_1 = require("../../../../../../../../src/services/user/entities/wrongList.entity");
var wrong_entity_1 = require("../../../../../../../../src/services/user/entities/wrong.entity");
var quizLog_entity_1 = require("../../../../../../../../src/services/user/entities/quizLog.entity");
var solvedProb_entity_1 = require("../../../../../../../../src/services/user/entities/solvedProb.entity");
var probLog_entity_1 = require("../../../../../../../../src/services/user/entities/probLog.entity");
var academy_entity_1 = require("../../../../../../../../src/services/academy/entities/academy.entity");
var class_entity_1 = require("../../../../../../../../src/services/academy/entities/class.entity");
var quiz_entity_1 = require("../../../../../../../../src/services/quiz/entities/quiz.entity");
var book_entity_1 = require("../../../../../../../../src/services/quiz/entities/book.entity");
var prob_entity_1 = require("../../../../../../../../src/services/quiz/entities/prob.entity");
var option_entity_1 = require("../../../../../../../../src/services/quiz/entities/option.entity");
var word_entity_1 = require("../../../../../../../../src/services/quiz/entities/word.entity");
var audio_entity_1 = require("../../../../../../../../src/services/audio/entities/audio.entity");
var board_entity_1 = require("../../../../../../../../src/services/board/entities/board.entity");
var post_entity_1 = require("../../../../../../../../src/services/board/entities/post.entity");
var comment_entity_1 = require("../../../../../../../../src/services/board/entities/comment.entity");
var reply_entity_1 = require("../../../../../../../../src/services/board/entities/reply.entity");
var page_entity_1 = require("../../../../../../../../src/services/academy/entities/page.entity");
var pageBoard_entity_1 = require("../../../../../../../../src/services/academy/entities/pageBoard.entity");
var voca_entity_1 = require("../../../../../../../../src/services/voca/entities/voca.entity");
var vocaWord_entity_1 = require("../../../../../../../../src/services/voca/entities/vocaWord.entity");
var EntityArr = [
    { resource: user_entity_1.UserEntity, options: { parent: { name: '회원' } } },
    { resource: userQuiz_entity_1.UserQuizEntity, options: { parent: { name: '회원퀴즈' } } },
    { resource: wrongList_entity_1.WrongListEntity, options: { parent: { name: '회원퀴즈' } } },
    { resource: wrong_entity_1.WrongEntity, options: { parent: { name: '회원퀴즈' } } },
    { resource: quizLog_entity_1.QuizLogEntity, options: { parent: { name: '회원퀴즈' } } },
    { resource: solvedProb_entity_1.SolvedProbEntity, options: { parent: { name: '회원퀴즈' } } },
    { resource: probLog_entity_1.ProbLogEntity, options: { parent: { name: '회원퀴즈' } } },
    { resource: academy_entity_1.AcademyEntity, options: { parent: { name: '학원' } } },
    { resource: class_entity_1.ClassEntity, options: { parent: { name: '학원' } } },
    { resource: page_entity_1.PageEntity, options: { parent: { name: '학원' } } },
    { resource: pageBoard_entity_1.PageBoardEntity, options: { parent: { name: '학원' } } },
    { resource: book_entity_1.BookEntity, options: { parent: { name: '퀴즈' } } },
    { resource: quiz_entity_1.QuizEntity, options: { parent: { name: '퀴즈' } } },
    { resource: prob_entity_1.ProbEntity, options: { parent: { name: '퀴즈' } } },
    { resource: option_entity_1.OptionEntity, options: { parent: { name: '퀴즈' } } },
    { resource: word_entity_1.WordEntity, options: { parent: { name: '퀴즈' } } },
    { resource: audio_entity_1.AudioEntity, options: { parent: { name: '음성' } } },
    { resource: board_entity_1.BoardEntity, options: { parent: { name: '게시판' } } },
    { resource: post_entity_1.PostEntity, options: { parent: { name: '게시판' } } },
    { resource: comment_entity_1.CommentEntity, options: { parent: { name: '게시판' } } },
    { resource: reply_entity_1.ReplyEntity, options: { parent: { name: '게시판' } } },
    { resource: voca_entity_1.VocaEntity, options: { parent: { name: '단어장' } } },
    { resource: vocaWord_entity_1.VocaWordEntity, options: { parent: { name: '단어장' } } },
];
exports["default"] = EntityArr;
