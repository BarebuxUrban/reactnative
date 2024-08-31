Фронт и бэк запускаются с npm run start

Зарегистрируйся на 10 минутный реальный имейл, затем войди по имейлу и паролю, после успешного логина переводит на ./Dashboard, либо при обновлении страницы. Выдаст ошибку на бэкэенде

Received token: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDYsImVtYWlsIjoib3pjODY5NzRAemNjY2suY29tIiwiaWF0IjoxNzI1MDE2Njg4LCJleHAiOjE3MjUwMjAyODh9.RJwV5eDTC3jCauObSExomalxdtsumCQROU0G2DcmiJc
Token verification error: JsonWebTokenError: invalid signature

Тебя может путать что в некоторых местах токен 'super_secret' а в некоторых process.env.JWT_SECRET, на самом деле везде 'super_secret'

На фронтенде:

Axios error че то там 500

На докер не обращай внимания, он не заюзан нигде

backup.dump - ЭТО ДАМП С ПОСТГРЕСОМ
