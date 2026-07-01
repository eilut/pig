# تعليمات النشر على VPS

هذا الدليل يشرح كيفية نشر منصة تسجيل المستفيدين على VPS خاص.

## المتطلبات

- VPS مع Ubuntu 20.04 أو أحدث
- Docker و Docker Compose مثبتة
- اسم نطاق (اختياري)
- شهادة SSL (اختياري لكن موصى به)

## الخطوة 1: إعداد VPS

### تثبيت Docker و Docker Compose

```bash
# تحديث النظام
sudo apt update && sudo apt upgrade -y

# تثبيت Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# تثبيت Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# إضافة المستخدم الحالي لمجموعة docker
sudo usermod -aG docker $USER
```

### السماح بالاتصال عبر المنافذ

```bash
# السماح بالاتصال على المنافذ 80 و 443
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp
sudo ufw enable
```

## الخطوة 2: رفع المشروع على VPS

### الخيار 1: استخدام Git

```bash
# استنساخ المستودع
git clone <your-repo-url> /var/www/pige
cd /var/www/pige
```

### الخيار 2: استخدام SCP

```bash
# من جهازك المحلي
scp -r pige/ user@your-vps-ip:/var/www/pige
```

## الخطوة 3: إعداد متغيرات البيئة

```bash
cd /var/www/pige

# إنشاء ملف .env
cp .env.example .env

# تعديل الملف بكلمات مرور قوية
nano .env
```

تأكد من تغيير:
- `MYSQL_ROOT_PASSWORD` - كلمة مرور قوية لـ MySQL
- `DB_PASSWORD` - كلمة مرور قوية لقاعدة البيانات
- `JWT_SECRET` - سلسلة عشوائية طويلة (يمكنك إنشاؤها باستخدام: `openssl rand -base64 32`)

## الخطوة 4: بناء وتشغيل التطبيق

```bash
# بناء الصور وتشغيل الحاويات
docker-compose -f docker-compose.prod.yml up -d --build

# التحقق من حالة الحاويات
docker-compose -f docker-compose.prod.yml ps

# عرض السجلات
docker-compose -f docker-compose.prod.yml logs -f
```

## الخطوة 5: إعداد SSL باستخدام Certbot (اختياري)

### تثبيت Certbot

```bash
sudo apt install certbot python3-certbot-nginx -y
```

### الحصول على شهادة SSL

```bash
# تأكد من أن اسم النطاق يشير إلى IP الخاص بـ VPS
sudo certbot --nginx -d your-domain.com
```

### تحديث nginx.conf لدعم SSL

عدّل ملف `frontend/nginx.conf` لاستخدام HTTPS:

```nginx
server {
    listen 443 ssl;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://backend:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}

server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}
```

أعد بناء الحاوية بعد التعديل:

```bash
docker-compose -f docker-compose.prod.yml up -d --build frontend
```

## الخطوة 6: النسخ الاحتياطي

### نسخ احتياطي لقاعدة البيانات

```bash
# إنشاء نسخة احتياطية
docker-compose -f docker-compose.prod.yml exec mysql mysqldump -u pige_user -ppige_password pige > backup_$(date +%Y%m%d).sql

# استعادة النسخة الاحتياطية
docker-compose -f docker-compose.prod.yml exec -T mysql mysql -u pige_user -ppige_password pige < backup_20240101.sql
```

### النسخ الاحتياطي التلقائي (Cron Job)

```bash
# إضافة job للنسخ الاحتياطي اليومي
crontab -e

# أضف السطر التالي (يعمل الساعة 2 صباحاً كل يوم)
0 2 * * * cd /var/www/pige && docker-compose -f docker-compose.prod.yml exec -T mysql mysqldump -u pige_user -ppige_password pige > /var/backups/pige_$(date +\%Y\%m\%d).sql
```

## إدارة التطبيق

### عرض السجلات

```bash
# سجلات جميع الخدمات
docker-compose -f docker-compose.prod.yml logs -f

# سجلات خدمة محددة
docker-compose -f docker-compose.prod.yml logs -f backend
docker-compose -f docker-compose.prod.yml logs -f frontend
```

### إعادة تشغيل الخدمات

```bash
# إعادة تشغيل جميع الخدمات
docker-compose -f docker-compose.prod.yml restart

# إعادة تشغيل خدمة محددة
docker-compose -f docker-compose.prod.yml restart backend
```

### تحديث التطبيق

```bash
# سحب التحديثات الجديدة
git pull

# إعادة بناء وتشغيل
docker-compose -f docker-compose.prod.yml up -d --build
```

### إيقاف التطبيق

```bash
docker-compose -f docker-compose.prod.yml down
```

## استكشاف الأخطاء

### الحاوية لا تعمل

```bash
# عرض حالة الحاويات
docker-compose -f docker-compose.prod.yml ps

# عرض سجلات الحاوية
docker-compose -f docker-compose.prod.yml logs <service-name>
```

### مشاكل في قاعدة البيانات

```bash
# الدخول إلى حاوية MySQL
docker-compose -f docker-compose.prod.yml exec mysql mysql -u pige_user -ppige_password pige

# التحقق من الاتصال بقاعدة البيانات
docker-compose -f docker-compose.prod.yml exec backend node -e "const mysql = require('mysql2'); const conn = mysql.createConnection({host: 'mysql', user: 'pige_user', password: 'pige_password', database: 'pige'}); conn.connect(err => {if(err) console.error(err); else console.log('Connected!'); conn.end();});"
```

### مشاكل في الذاكرة

```bash
# عرض استخدام الموارد
docker stats
```

## الأمان

### تأمين قاعدة البيانات

- تأكد من عدم كشف منفذ MySQL للعالم (3306) إلا إذا لزم الأمر
- استخدم كلمات مرور قوية
- قم بتحديث النظام بانتظام

### تأمين الخادم

```bash
# تثبيت fail2ban
sudo apt install fail2ban -y

# تفعيل UFW
sudo ufw status
```

## الملاحظات

- التطبيق سيعمل على المنفذ 80 (HTTP) ويمكن إعداد SSL للمنفذ 443
- قاعدة البيانات محفوظة في Docker volume
- التطبيق يعمل في وضع الإنتاج (NODE_ENV=production)
- الواجهة الأمامية تخدمها Nginx
- الـ Backend يعمل على المنفذ 3000 (داخل الشبكة الداخلية)
