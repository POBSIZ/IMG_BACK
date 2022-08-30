# **IMG_BACK**

> **이미지 어학원 웹앱 BACK**

<br/>

# Code

```powershell
nest g resource [name]
```

<br/>

# 커밋 컨벤션

- **Feat**: 새로운 기능을 추가할 경우
- **Fix**: 버그를 고친 경우
- **Design**: CSS 등 사용자 UI 디자인 변경
- **!BREAKING CHANGE**: 커다란 API 변경의 경우
- **!HOTFIX**: 급하게 치명적인 버그를 고쳐야하는 경우
- **Style**: 코드 포맷 변경, 세미 콜론 누락, 코드 수정이 없는 경우
- **Refactor**: 프로덕션 코드 리팩토링
- **Comment**: 필요한 주석 추가 및 변경
- **Docs**: 문서를 수정한 경우
- **Test**: 테스트 추가, 테스트 리팩토링(프로덕션 코드 변경 X)
- **Chore**: 빌드 테스트 업데이트, 패키지 매니저를 설정하는 경우(프로덕션 코드 변경 X)
- **Rename**: 파일 혹은 폴더명을 수정하거나 옮기는 작업만인 경우
- **Remove**: 파일을 삭제하는 작업만 수행한 경우
- **출처**: https://overcome-the-limits.tistory.com/6?category=923736

<br/>

# 코드 컨벤션

1. **함수**
2. **타입**
3. **변수**
4. **파일**

<br/>

### **함수**

함수명의 경우 Camel Case를 활용하여 작성한다.<br/>
함수명의 첫 글자는 무조건 소문자로 작성한다.<br/>
기본적으로 Arrow Function으로 작성한다.<br/>
redux-saga에서의 함수는 function 키워드를 이용하여 작성한다.<br/>

```typescript
// Base
const baseFunc = () => {};

// Redux-Saga
function sagaFunc() {}
```

<br/>

### **타입**

타입명의 경우 Pascal Case를 활용하여 작성한다.<br/>
타입명의 어두는 반드시 대문자로 작성한다.<br/>
타입명의 어미에는 반드시 "Type" 을 붙여준다.<br/>

```typescript
interface BaseType {}
type BaseType {}
```

<br/>

### **변수**

변수명의 경우 Camel Case를 활용하여 작성한다.<br/>

```typescript
const baseVar;
let baseVar;
```

<br/>
