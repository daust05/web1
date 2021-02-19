let addButton = document.querySelector('.button');

function Person(name = 'Bob', age = 19){
    this.name = name;
    this.age = age;
    // 보통 메소드는 밖에 작성
    this.intro = function(){
        console.log('Hi I am ' + name +' and I am '+age+' years old\n');
    }
}
Person.prototype.addAge = function(){
    this.age++;
}

// Person 상속 Teacher
function Teacher(subject, name, age){
    Person.call(this,name,age)
    this.subject= subject;
    this.student= [];
}
// 메소드 상속은 따로 해줘야됨
Teacher.prototype = Object.create(Person.prototype);
// 생성자 변경 해줘야됨
Teacher.prototype.constructor = Teacher;
// 메소드
Teacher.prototype.makeStudent = function(student){
    this.student.push(student);
    student.teacher = this;
}
Teacher.prototype.getStudent = function(){
    return this.student;
}

class Student extends Person{
    constructor(name, age){
        super(name, age);
        this.teacher;
        this.subject;
    }
}

let bob = new Person();
let sarah = new Person('Sarah', 19)
let teacher = new Teacher('math', 'Ssam', 25);
teacher.makeStudent(bob);
teacher.makeStudent(sarah);
teacher.addAge();
console.log(teacher.getStudent());
// 버튼 
addButton.addEventListener('click',bob.intro);
