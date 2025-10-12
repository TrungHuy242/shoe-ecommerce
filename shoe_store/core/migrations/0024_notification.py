# Generated manually for Notification model

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('core', '0023_shippingaddress_order_shipping_address'),
    ]

    operations = [
        migrations.CreateModel(
            name='Notification',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('type', models.CharField(choices=[('order_confirmed', 'Đơn hàng được xác nhận'), ('order_shipped', 'Đơn hàng đã giao hàng'), ('order_delivered', 'Đơn hàng đã giao thành công'), ('promotion', 'Khuyến mãi mới'), ('system', 'Thông báo hệ thống')], max_length=20)),
                ('title', models.CharField(max_length=200)),
                ('message', models.TextField(default='')),
                ('is_read', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('related_order', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='core.order')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='notifications', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['-created_at'],
            },
        ),
    ]
