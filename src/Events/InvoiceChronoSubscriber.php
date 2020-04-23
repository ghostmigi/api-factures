<?php

namespace App\Events;

use ApiPlatform\Core\EventListener\EventPriorities;
use App\Entity\Invoice;
use App\Repository\InvoiceRepository;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\Form\Extension\Core\Type\DateType;
use Symfony\Component\HttpKernel\Event\GetResponseForControllerResultEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\Security\Core\Security;

class InvoiceChronoSubscriber implements EventSubscriberInterface {

    private $security;
    private $repository;

    public function __construct(Security $security, InvoiceRepository $repository)
    {
        $this->security = $security;        // Pour choper l'utilisateur
        $this->repository = $repository;    // Pour choper les factures
    }

    public static function getSubscribedEvents()
    {
        return [
          KernelEvents::VIEW => ['setChronoForInvoice', EventPriorities::PRE_VALIDATE]
        ];
    }

    public function setChronoForInvoice(GetResponseForControllerResultEvent $event){
        // 1 - J'ai besoin de trouver l'utilisateur actuellement connecte (security)
        // 2 - J'ai besoin du repository des factures (InvoicerRepository)
        // 3 - Choper la derniere facture qui a ete inseree, et choper son chrono
        // 4 - Dans cette nouvelle facture, on donne le dernier chrono + 1
        $invoice = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();

        if ($invoice instanceof Invoice && $method === "POST"){
            $nextChrono = $this->repository->findNextChrono($this->security->getUser());
            $invoice->setChrono($nextChrono);

            // TODO : A deplacer dans une classe dediee
            if (empty($invoice->getSentAt())){
                $invoice->setSentAt(new \DateTime());
            }
        }
    }

}