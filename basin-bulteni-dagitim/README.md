# Basın Bülteni Dağıtım Sistemi

Bu proje, kamu kurumlarının basın bültenlerini yönetip dağıtabileceği modern bir full-stack web uygulamasıdır.

## 🚀 Özellikler

- **Kullanıcı Yönetimi**: JWT tabanlı kimlik doğrulama ve yetkilendirme
- **Rol Tabanlı Erişim**: Admin ve User rolleri
- **Basın Bülteni Yönetimi**: CRUD işlemleri, durum yönetimi
- **Arama ve Filtreleme**: Başlığa göre arama, duruma göre filtreleme
- **Responsive Tasarım**: Mobil ve masaüstü uyumlu
- **Modern UI**: Tailwind CSS ile sade ve profesyonel görünüm

## 🛠️ Teknolojiler

### Backend
- **Java 17**
- **Spring Boot 3.2.0**
- **Spring Security + JWT**
- **Spring Data JPA**
- **PostgreSQL 17**
- **Maven**

### Frontend
- **React 18**
- **Vite**
- **React Router DOM**
- **Tailwind CSS**
- **Axios**
- **Lucide React Icons**

## 📋 Gereksinimler

- Java 17+
- Node.js 16+
- PostgreSQL 17
- Maven 3.6+

## 🚀 Kurulum

### 1. Veritabanı Kurulumu

PostgreSQL'de yeni bir veritabanı oluşturun:

```sql
CREATE DATABASE kamu_bulteni_dagitim_db;
```

### 2. Backend Kurulumu

```bash
cd backend

# Bağımlılıkları yükleyin
mvn clean install

# Uygulamayı çalıştırın
mvn spring-boot:run
```

Backend varsayılan olarak `http://localhost:8080` adresinde çalışacaktır.

### 3. Frontend Kurulumu

```bash
cd frontend

# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm run dev
```

Frontend varsayılan olarak `http://localhost:5173` adresinde çalışacaktır.

## 🔐 Varsayılan Kullanıcı

Sistem ilk çalıştırıldığında otomatik olarak bir admin kullanıcısı oluşturulur:

- **Email**: admin
- **Şifre**: admin123

## 📁 Proje Yapısı

```
basin-bulteni-dagitim/
├── backend/
│   ├── src/main/java/com/kamu/basinbulteni/
│   │   ├── config/
│   │   ├── controller/
│   │   ├── dto/
│   │   ├── model/
│   │   ├── repository/
│   │   └── service/
│   ├── src/main/resources/
│   │   └── application.yml
│   └── pom.xml
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── pages/
│   │   └── services/
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## 🔧 Konfigürasyon

### Backend Konfigürasyonu

`backend/src/main/resources/application.yml` dosyasında veritabanı bağlantı ayarlarını düzenleyin:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/kamu_bulteni_dagitim_db
    username: postgres
    password: postgres
```

### Frontend Konfigürasyonu

`frontend/vite.config.js` dosyasında API proxy ayarları mevcuttur:

```javascript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true
    }
  }
}
```

## 📚 API Endpoints

### Kimlik Doğrulama
- `POST /api/auth/register` - Kullanıcı kaydı
- `POST /api/auth/login` - Kullanıcı girişi

### Basın Bültenleri
- `GET /api/press-releases` - Bülten listesi
- `POST /api/press-releases` - Yeni bülten oluşturma
- `GET /api/press-releases/{id}` - Bülten detayı
- `PUT /api/press-releases/{id}` - Bülten güncelleme
- `DELETE /api/press-releases/{id}` - Bülten silme
- `PATCH /api/press-releases/{id}/status` - Durum güncelleme

## 🎨 Kullanıcı Arayüzü

### Sayfalar
- **Login**: Kullanıcı girişi
- **Register**: Kullanıcı kaydı
- **Dashboard**: Ana sayfa ve istatistikler
- **Press Release List**: Bülten listesi ve filtreleme
- **Press Release Form**: Bülten oluşturma/düzenleme
- **Press Release Detail**: Bülten detay görüntüleme
- **Profile**: Kullanıcı profili

### Özellikler
- Responsive tasarım
- Modern ve sade arayüz
- Kolay navigasyon
- Gerçek zamanlı arama ve filtreleme
- Rol tabanlı menü görünümü

## 🔒 Güvenlik

- JWT tabanlı kimlik doğrulama
- Rol tabanlı yetkilendirme
- Şifre hashleme (BCrypt)
- CORS konfigürasyonu
- Input validasyonu

## 🚀 Geliştirme

### Backend Geliştirme

```bash
cd backend
mvn spring-boot:run
```

### Frontend Geliştirme

```bash
cd frontend
npm run dev
```

### Build

```bash
# Backend
cd backend
mvn clean package

# Frontend
cd frontend
npm run build
```

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'Add some amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📞 İletişim

Proje hakkında sorularınız için issue açabilirsiniz.
