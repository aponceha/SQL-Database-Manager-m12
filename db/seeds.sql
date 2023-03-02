INSERT INTO department (dept_name)
VALUES ("Engineering"),
       ("Finance"),
       ("Legal"),
       ("Sales"),
       ("Human Resources");

INSERT INTO roles (title, salary, department_id)
VALUES ("Sales Lead", 100000, 4),
       ("Salesperson", 80000, 4),
       ("Lead Engineer", 150000, 1),
       ("Software Engineer", 120000, 1),
       ("Accountant", 125000, 2),
       ("Legal Team Lead", 250000, 3),
       ("Lawyer", 190000, 3);

       

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Steve", "Holt", 1, null),
       ("John", "Smith", 2, 1),
       ("Jane", "Doe", 3, null),
       ("Mike", "Chan", 4, 3),
       ("Ashley", "Rodriguez", 5, null),
       ("Kevin", "Tupik", 6, null),
       ("Malia", "Brown", 7, 6),
       ("Sarah", "Lourd", 2, 1),
       ("Tom", "Allen", 4, 3);

 
