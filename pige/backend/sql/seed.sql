INSERT INTO Directorates (Directorate_Name) VALUES ('المدينة'), ('الرجم'), ('شبام');
INSERT INTO Programs (Program_Name, Directorate, Sessions_Count, Male_Seats, Female_Seats, Program_Status) 
VALUES 
('دورة أساسيات الحاسوب', 'المدينة', 10, 20, 20, 'open'),
('دورة التصميم الجرافيكي', 'المدينة', 15, 10, 15, 'open'),
('دورة صيانة الهواتف', 'الرجم', 12, 15, 0, 'open'),
('دورة الخياطة والتطريز', 'شبام', 20, 0, 30, 'open');
