USE companyDB;

INSERT INTO department(name)
    VALUES
        ('Sales'),
        ('Legal'),
        ('Human Resources'),
        ('Accounting');

INSERT INTO role(title, department_id, salary)
    VALUES
        ('Sales Manager', 1, 150000),
        ('Legal Assistant', 2, 50000),
        ('Senior Manager', 3, 170000),
        ('Lawyer', 2, 175000),
        ('CPA', 4, 125000),
        ('Sales Associate', 1, 85000);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
    VALUES
        ('Gregory', 'Wyrick', 1, null),
        ('Eron', 'Yager', 6, 1),
        ('Josh', 'Filman', 3, null),
        ('Joe', 'Rogan', 4, 3),
        ('Anne', 'Johnson', 2, 4),
        ('Lilly', 'Ngyuen', 5, null);