# Generated migration for ChatbotMetrics
# Run: python manage.py migrate

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0030_chatbotconversation_chatbotfeedback'),
    ]

    operations = [
        migrations.CreateModel(
            name='ChatbotMetrics',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField(db_index=True, unique=True)),
                ('total_interactions', models.IntegerField(default=0)),
                ('unique_users', models.IntegerField(default=0)),
                ('unique_sessions', models.IntegerField(default=0)),
                ('product_searches', models.IntegerField(default=0)),
                ('product_clicks', models.IntegerField(default=0)),
                ('product_purchases', models.IntegerField(default=0)),
                ('promotion_views', models.IntegerField(default=0)),
                ('order_queries', models.IntegerField(default=0)),
                ('positive_feedback', models.IntegerField(default=0)),
                ('negative_feedback', models.IntegerField(default=0)),
                ('avg_confidence_score', models.FloatField(default=0.0)),
                ('avg_processing_time', models.FloatField(default=0.0)),
                ('conversion_rate', models.FloatField(default=0.0)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'verbose_name': 'Chatbot Metric',
                'verbose_name_plural': 'Chatbot Metrics',
                'ordering': ['-date'],
            },
        ),
    ]

